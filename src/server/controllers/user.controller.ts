import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import type { RouteHandler } from "@hono/zod-openapi";
import type { checkOsNameRoute } from "../routes/user.route";

export const checkOsNameHandler: RouteHandler<typeof checkOsNameRoute> = async (c) => {
	const { osName } = c.req.valid("json");

	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session || !session.user?.id) {
		throw new Error("Unauthorized");
	}

	const exists = await prisma.user.findUnique({ where: { osName } });

	if (exists) {
		return c.json(null, 409);
	}

	return c.json(null, 200);
};
