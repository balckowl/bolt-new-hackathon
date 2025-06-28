import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import type { RouteHandler } from "@hono/zod-openapi";
import { stateSchema } from "../models/os.schema";
import type {
	getDesktopStateRoute,
	updateBackgroundRoute,
	updateDesktopStateRoute,
	updateVisibilityRoute,
} from "../routes/os.route";

export const getDesktopStateHandler: RouteHandler<typeof getDesktopStateRoute> = async (c) => {
	const { osName } = c.req.param();

	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session?.user?.id) {
		throw new Error("Unauthorized");
	}

	const userWithDesktop = await prisma.user.findUnique({
		where: { osName },
		select: {
			id: true,
			desktop: {
				select: {
					state: true,
					isPublic: true,
					background: true,
				},
			},
		},
	});

	if (!userWithDesktop || !userWithDesktop.desktop) {
		return c.json(null, 404);
	}

	const rawJson = userWithDesktop.desktop.state;
	const parsedState = stateSchema.parse(rawJson);

	const isEdit = session.user.id === userWithDesktop.id;

	const result = {
		state: parsedState,
		isPublic: userWithDesktop.desktop.isPublic,
		background: userWithDesktop.desktop.background,
		isEdit,
	};

	return c.json(result, 200);
};

export const updateDesktopStateHandler: RouteHandler<typeof updateDesktopStateRoute> = async (
	c,
) => {
	const { state } = c.req.valid("json");

	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session?.user?.id) {
		throw new Error("Unauthorized");
	}

	const updateResult = await prisma.desktop.updateMany({
		where: { userId: session.user.id },
		data: { state },
	});

	if (updateResult.count === 0) {
		return c.json(null, 404);
	}

	const desktop = await prisma.desktop.findUnique({
		where: { userId: session.user.id },
		select: { state: true, isPublic: true, background: true },
	});

	if (!desktop) {
		return c.json(null, 404);
	}

	//prismaでjsonの中を型付けできないのでここで検証する必要があるのかよ！
	const rawJson = desktop.state;
	const parsedState = stateSchema.parse(rawJson);

	const result = {
		state: parsedState,
		isPublic: desktop.isPublic,
		background: desktop.background,
		isEdit: true,
	};

	return c.json(result, 200);
};

export const updateDesktopVisibilityHandler: RouteHandler<typeof updateVisibilityRoute> = async (
	c,
) => {
	const { isPublic } = c.req.valid("json");

	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session?.user?.id) {
		throw new Error("Unauthorized");
	}

	const result = await prisma.desktop.updateMany({
		where: { userId: session.user.id },
		data: { isPublic },
	});

	if (result.count === 0) return c.json(null, 404);

	return c.json(null, 200);
};

export const updateDesktopBackgroundHandler: RouteHandler<typeof updateBackgroundRoute> = async (
	c,
) => {
	const { background } = c.req.valid("json");

	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session?.user?.id) {
		throw new Error("Unauthorized");
	}

	const result = await prisma.desktop.updateMany({
		where: { userId: session.user.id },
		data: { background },
	});

	if (result.count === 0) return c.json(null, 404);

	return c.json(null, 200);
};
