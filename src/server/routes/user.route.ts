import { createRoute, z } from "@hono/zod-openapi";
import { osNameCheckSchema, setOsNameSchema } from "../models/user.schema";

export const checkOsNameRoute = createRoute({
	path: "/os/check-name",
	method: "post",
	description: "ユーザー名の重複チェック",
	request: {
		body: {
			content: {
				"application/json": {
					schema: osNameCheckSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: "成功",
			content: {
				"application/json": {
					schema: z.null(),
				},
			},
		},
		400: {
			description: "不正なリクエスト",
			content: {
				"application/json": {
					schema: z.null(),
				},
			},
		},
		404: {
			description: "ユーザーが見つからない",
			content: {
				"application/json": {
					schema: z.null(),
				},
			},
		},
		409: {
			description: "重複",
			content: {
				"application/json": {
					schema: z.null(),
				},
			},
		},
	},
});

export const setOsNameRoute = createRoute({
	path: "/user/os-name",
	method: "post",
	description: "ユーザー名の設定",
	request: {
		body: {
			content: {
				"application/json": {
					schema: setOsNameSchema,
				},
			},
		},
	},
	responses: {
		201: {
			description: "成功",
			content: {
				"application/json": {
					schema: z.null(),
				},
			},
		},
		400: {
			description: "不正なリクエスト",
			content: {
				"application/json": {
					schema: z.null(),
				},
			},
		},
		404: {
			description: "ユーザーが見つからない",
			content: {
				"application/json": {
					schema: z.null(),
				},
			},
		},
		409: {
			description: "重複",
			content: {
				"application/json": {
					schema: z.null(),
				},
			},
		},
	},
});
