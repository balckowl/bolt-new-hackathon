import { UserSchema } from "@/prisma/prisma/zod";
import { z } from "@hono/zod-openapi";

export const osNameBaseSchema = UserSchema.pick({
	osName: true,
}).extend({
	osName: z
		.string()
		.min(2, { message: "OS 名は2文字以上で入力してください。" })
		.max(10, { message: "OS 名は10文字以下で入力してください。" }),
});

export const osNameCheckSchema = osNameBaseSchema.openapi({
	description: "重複チェック対象の OS 名",
	example: { osName: "yuuta" },
});

export const setOsNameSchema = osNameBaseSchema.openapi({
	description: "ユーザーの OS 名を設定するためのペイロード",
	example: { osName: "yuuta" },
});
