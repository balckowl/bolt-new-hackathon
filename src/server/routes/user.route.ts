import { createRoute, z } from "@hono/zod-openapi";
import { osNameCheckSchema } from "../models/user.schema";

export const checkOsNameRoute = createRoute({
	path: "/os/check-name",
	method: "post",
	description: "ユーザー名の設定",
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
