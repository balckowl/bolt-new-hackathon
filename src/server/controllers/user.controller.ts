import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import type { RouteHandler } from "@hono/zod-openapi";
import type { WithAuthenticatedRequest } from "../middleware/authMIddleware";
import type { checkOsNameRoute, setOsNameRoute } from "../routes/user.route";

export const checkOsNameHandler: RouteHandler<
	typeof checkOsNameRoute,
	WithAuthenticatedRequest
> = async (c) => {
	const { osName } = c.req.valid("json");

	const me = await prisma.user.findUnique({
		where: { id: c.var.userId },
		select: { osName: true },
	});

	if (!me) {
		return c.json(null, 404);
	}

	if (me.osName !== null) {
		return c.json(null, 400);
	}

	const exists = await prisma.user.findUnique({ where: { osName } });

	if (exists) {
		return c.json(null, 409);
	}

	return c.json(null, 200);
};

export const setOsNameHandler: RouteHandler<
	typeof setOsNameRoute,
	WithAuthenticatedRequest
> = async (c) => {
	const { osName } = c.req.valid("json");

	const me = await prisma.user.findUnique({
		where: { id: c.var.userId },
		select: { osName: true },
	});

	if (!me) {
		return c.json(null, 404);
	}

	if (me.osName !== null) {
		return c.json(null, 400);
	}

	const exists = await prisma.user.findUnique({ where: { osName } });

	if (exists) {
		return c.json(null, 409);
	}

	await prisma.user.update({
		where: { id: c.var.userId },
		data: {
			osName,
			desktop: {
				create: {
					state: {
						apps: [
							{
								id: "app-1",
								name: "Intro",
								iconKey: "StickyNote",
								color: "#FFEB3B",
								type: "memo",
								content:
									"<p>Thank you for using this site! 🎉✨<br>You can find instructions on how to use it under <strong>Instructions</strong> in the menu bar.</p>",
							},
						],
						appPositions: {
							"app-1": {
								row: 0,
								col: 0,
							},
						},
					},
				},
			},
		},
	});

	return c.json(null, 201);
};
