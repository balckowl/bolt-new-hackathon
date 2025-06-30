import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import type { RouteHandler } from "@hono/zod-openapi";
import { revalidateTag } from "next/cache";
import type { WithAuthenticatedRequest } from "../middleware/authMIddleware";
import { stateSchema } from "../models/os.schema";
import type {
	getDesktopStateRoute,
	updateBackgroundRoute,
	updateDesktopStateRoute,
	updateVisibilityRoute,
} from "../routes/os.route";

export const getDesktopStateHandler: RouteHandler<
	typeof getDesktopStateRoute,
	WithAuthenticatedRequest
> = async (c) => {
	const { osName } = c.req.param();

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

	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	const isEdit = session?.user.id === userWithDesktop.id;

	if (!userWithDesktop.desktop.isPublic && !isEdit) {
		return c.json(null, 403);
	}

	const rawJson = userWithDesktop.desktop.state;
	const parsedState = stateSchema.parse(rawJson);

	const result = {
		state: parsedState,
		isPublic: userWithDesktop.desktop.isPublic,
		background: userWithDesktop.desktop.background,
		isEdit,
		currentUsername: session?.user.name ?? null,
		currentUserOsName: session?.user.osName ?? null,
		currentUserIcon: session?.user.image ?? null,
	};

	return c.json(result, 200);
};

export const updateDesktopStateHandler: RouteHandler<
	typeof updateDesktopStateRoute,
	WithAuthenticatedRequest
> = async (c) => {
	const { state } = c.req.valid("json");

	const updateResult = await prisma.desktop.updateMany({
		where: { userId: c.var.userId },
		data: { state },
	});

	if (updateResult.count === 0) {
		return c.json(null, 404);
	}

	const desktop = await prisma.desktop.findUnique({
		where: { userId: c.var.userId },
		select: { state: true, isPublic: true, background: true },
	});

	if (!desktop) {
		return c.json(null, 404);
	}

	//prismaでjsonの中を型付けできないのでここで検証する必要があるのかよ！
	// const rawJson = desktop.state;
	// const parsedState = stateSchema.parse(rawJson);

	// const result = {
	//   state: parsedState,
	//   isPublic: desktop.isPublic,
	//   background: desktop.background,
	//   isEdit: true,
	// };

	//cacheを更新
	revalidateTag("desktop");

	return c.json(null, 200);
};

export const updateDesktopVisibilityHandler: RouteHandler<
	typeof updateVisibilityRoute,
	WithAuthenticatedRequest
> = async (c) => {
	const { isPublic } = c.req.valid("json");

	const result = await prisma.desktop.updateMany({
		where: { userId: c.var.userId },
		data: { isPublic },
	});

	if (result.count === 0) return c.json(null, 404);

	//cacheを更新
	revalidateTag("desktop");

	return c.json(null, 200);
};

export const updateDesktopBackgroundHandler: RouteHandler<
	typeof updateBackgroundRoute,
	WithAuthenticatedRequest
> = async (c) => {
	const { background } = c.req.valid("json");

	const result = await prisma.desktop.updateMany({
		where: { userId: c.var.userId },
		data: { background },
	});

	if (result.count === 0) return c.json(null, 404);

	//cacheを更新
	revalidateTag("desktop");

	return c.json(null, 200);
};
