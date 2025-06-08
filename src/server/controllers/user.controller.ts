import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import type { RouteHandler } from "@hono/zod-openapi";
import type { checkOsNameRoute, setOsNameRoute } from "../routes/user.route";

export const checkOsNameHandler: RouteHandler<typeof checkOsNameRoute> = async (c) => {
	const { osName } = c.req.valid("json");

	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session?.user?.id) {
		throw new Error("Unauthorized");
	}

	const me = await prisma.user.findUnique({
		where: { id: session.user.id },
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

export const setOsNameHandler: RouteHandler<typeof setOsNameRoute> = async (c) => {
	const { osName } = c.req.valid("json");

	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session?.user?.id) {
		throw new Error("Unauthorized");
	}

	const me = await prisma.user.findUnique({
		where: { id: session.user.id },
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
		where: { id: session.user.id },
		data: { osName },
		select: { osName: true },
	});

	return c.json(null, 201);
};
