import { UserSchema } from "@/prisma/prisma/zod";
import { z } from "@hono/zod-openapi";

export const osNameBaseSchema = UserSchema.pick({
	osName: true,
}).extend({
	osName: z
		.string()
		.min(2, { message: "OS name must be at least 2 characters long." })
		.max(10, { message: "OS name must be at most 10 characters long." })
		.regex(/^[A-Za-z]+$/, {
			message: "OS name can only contain letters (A–Z, a–z).",
		}),
});

export const osNameCheckSchema = osNameBaseSchema.openapi({
	description: "重複チェック対象の OS 名",
	example: { osName: "yuuta" },
});

export const setOsNameSchema = osNameBaseSchema.openapi({
	description: "ユーザーの OS 名を設定するためのペイロード",
	example: { osName: "yuuta" },
});
