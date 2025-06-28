import { DesktopSchema } from "@/prisma/prisma/zod";
import { z } from "@hono/zod-openapi";

const positionSchema = z.object({
	row: z.number().min(0).max(9),
	col: z.number().min(0).max(5),
});

const appSchema = z.object({
	id: z.string(),
	name: z.string(),
	//enumで与える
	iconKey: z.enum(["StickyNote", "Globe", "FolderIcon"]),
	color: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/),
	type: z.enum(["app", "memo", "website", "folder"]).optional(),
	content: z.string().optional(),
	url: z.string().url().optional(),
	favicon: z.string().url().optional(),
});

export const stateSchema = z
	.object({
		apps: z.array(appSchema).default([]),
		appPositions: z.record(positionSchema).default({}),
	})
	.superRefine((data, ctx) => {
		const appIds = data.apps.map((app) => app.id);

		// 1) apps の重複チェック
		const dupAppIds = appIds.filter((id, i) => appIds.indexOf(id) !== i);
		if (dupAppIds.length) {
			ctx.addIssue({
				code: "custom",
				path: ["apps"],
				message: `apps 内に重複した id があります: ${[...new Set(dupAppIds)].join(", ")}`,
			});
		}

		const posEntries = Object.entries(data.appPositions); // [ [id, {row,col}], ... ]
		const posIds = posEntries.map(([id]) => id);

		// 2) apps → appPositions 存在チェック
		const missingInPos = appIds.filter((id) => !posIds.includes(id));
		if (missingInPos.length) {
			ctx.addIssue({
				code: "custom",
				path: ["appPositions"],
				message: `appPositions に missing です: ${missingInPos.join(", ")}`,
			});
		}

		// 3) appPositions → apps 余分キーチェック
		const extraInPos = posIds.filter((id) => !appIds.includes(id));
		if (extraInPos.length) {
			ctx.addIssue({
				code: "custom",
				path: ["appPositions"],
				message: `appPositions に apps にないキーがあります: ${extraInPos.join(", ")}`,
			});
		}

		// 4) row/col の重複チェック
		//    位置を文字列化して重複検出
		const coords = posEntries.map(([_, pos]) => `${pos.row},${pos.col}`);
		const dupCoords = coords.filter((c, i) => coords.indexOf(c) !== i);
		const uniqCoords = [...new Set(dupCoords)];

		// forEach を for…of に置き換え
		for (const duplicate of uniqCoords) {
			const [row, col] = duplicate.split(",").map(Number);
			ctx.addIssue({
				code: "custom",
				path: ["appPositions"],
				message: `row:${row}, col:${col} の位置が複数のアプリで使われています。`,
			});
		}
	})
	.openapi({
		example: {
			apps: [
				{
					id: "app-1",
					name: "メモ帳",
					iconKey: "StickyNote",
					color: "#FFEB3B",
					type: "memo",
					content: "これはサンプルのメモです。",
				},
				{
					id: "app-2",
					name: "ブラウザ",
					iconKey: "Globe",
					color: "#2196F3",
					type: "website",
					url: "https://openai.com",
					favicon: "https://openai.com/favicon.ico",
				},
				{
					id: "app-3",
					name: "フォルダ",
					iconKey: "FolderIcon",
					color: "#FFC107",
					type: "folder",
				},
			],
			appPositions: {
				"app-1": { row: 0, col: 0 },
				"app-2": { row: 0, col: 1 },
				"app-3": { row: 1, col: 0 },
			},
		},
	});

export const isPublicSchema = DesktopSchema.pick({ isPublic: true });
export const backgroundSchema = DesktopSchema.pick({ background: true });

export const desktopStateSchema = z
	.object({
		state: stateSchema,
		//編集ができるかどうか
		isEdit: z.boolean(),
	})
	.extend(isPublicSchema.shape)
	.extend(backgroundSchema.shape);
