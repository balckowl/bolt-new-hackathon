import { createRoute, z } from "@hono/zod-openapi";
import {
	backgroundSchema,
	desktopStateSchema,
	isPublicSchema,
	stateSchema,
} from "../models/os.schema";
import { osNameBaseSchema } from "../models/user.schema";

export const getDesktopStateRoute = createRoute({
	path: "/desktop/{osName}/state",
	method: "get",
	description: "デスクトップの状態を取得",
	request: {
		params: osNameBaseSchema,
	},
	responses: {
		200: {
			description: "取得成功",
			content: { "application/json": { schema: desktopStateSchema } },
		},
		404: {
			description: "デスクトップ情報が見つかりませんでした。",
			content: {
				"application/json": {
					schema: z.null(),
				},
			},
		},
	},
});

export const updateDesktopStateRoute = createRoute({
	path: "/desktop/state",
	method: "put",
	description: "デスクトップの状態を更新",
	request: {
		body: {
			content: {
				"application/json": {
					schema: z.object({
						state: stateSchema,
					}),
				},
			},
		},
	},
	responses: {
		200: {
			description: "更新成功",
			content: { "application/json": { schema: desktopStateSchema } },
		},
		404: {
			description: "デスクトップ情報が見つかりませんでした。",
			content: {
				"application/json": {
					schema: z.null(),
				},
			},
		},
	},
});

export const updateVisibilityRoute = createRoute({
	path: "/desktop/visibility",
	method: "put",
	description: "自分のデスクトップの公開設定を更新",
	request: {
		body: {
			content: {
				"application/json": {
					schema: isPublicSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: "更新成功",
			content: { "application/json": { schema: z.null() } },
		},
		404: {
			description: "デスクトップ情報が見つかりませんでした。",
			content: { "application/json": { schema: z.null() } },
		},
	},
});

export const updateBackgroundRoute = createRoute({
	path: "/desktop/background",
	method: "put",
	description: "自分のデスクトップの背景を更新",
	request: {
		body: {
			content: {
				"application/json": {
					schema: backgroundSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: "更新成功",
			content: { "application/json": { schema: z.null() } },
		},
		404: {
			description: "デスクトップ情報が見つかりませんでした。",
			content: { "application/json": { schema: z.null() } },
		},
	},
});
