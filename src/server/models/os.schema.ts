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
		folderContents: z.record(z.array(z.string())).default({}),
	})
	.superRefine((data, ctx) => {
		const { apps, appPositions, folderContents } = data;
		const appIds = apps.map((a) => a.id);
		const posIds = Object.keys(appPositions);
		const childIds = Object.values(folderContents).flat();

		// 1) apps と appPositions の重複チェック（従来通り）
		const dupAppIds = appIds.filter((id, i) => appIds.indexOf(id) !== i);
		if (dupAppIds.length) {
			ctx.addIssue({
				code: "custom",
				path: ["apps"],
				message: `apps 内に重複した id があります: ${[...new Set(dupAppIds)].join(", ")}`,
			});
		}

		// 2) apps → appPositions 存在チェック（ルートに置かれるべきもの全てがポジションを持つか？）
		//    ただし、childIds（ネストされるもの）は除外
		const expectedRootIds = appIds.filter((id) => !childIds.includes(id));
		const missingRoot = expectedRootIds.filter((id) => !posIds.includes(id));
		if (missingRoot.length) {
			ctx.addIssue({
				code: "custom",
				path: ["appPositions"],
				message: `ルートのアプリにポジションがありません: ${missingRoot.join(", ")}`,
			});
		}

		// 3) appPositions → apps 余分キーチェック（ネストされたものが混ざっていないか）
		const extraRoot = posIds.filter((id) => !expectedRootIds.includes(id));
		if (extraRoot.length) {
			ctx.addIssue({
				code: "custom",
				path: ["appPositions"],
				message: `appPositions にルート以外のキーがあります: ${extraRoot.join(", ")}`,
			});
		}

		// 4) folderContents のキー／値チェック
		//   - キーは必ず type==="folder" のものだけ
		//   - 子要素は必ず apps に含まれているものだけ
		for (const [folderId, children] of Object.entries(folderContents)) {
			const folderApp = apps.find((a) => a.id === folderId);
			if (!folderApp || folderApp.type !== "folder") {
				ctx.addIssue({
					code: "custom",
					path: ["folderContents", folderId],
					message: `"${folderId}" はフォルダ型ではありません。`,
				});
			}
			const invalidChildren = children.filter((cid) => !appIds.includes(cid));
			if (invalidChildren.length) {
				ctx.addIssue({
					code: "custom",
					path: ["folderContents", folderId],
					message: `${folderId} に存在しないアプリIDが含まれています: ${invalidChildren.join(", ")}`,
				});
			}
		}

		// 5) row/col の重複チェック（従来通り）
		const coords = Object.values(appPositions).map((p) => `${p.row},${p.col}`);
		const dupCoords = coords.filter((c, i) => coords.indexOf(c) !== i);
		for (const dup of Array.from(new Set(dupCoords))) {
			const [r, c] = dup.split(",").map(Number);
			ctx.addIssue({
				code: "custom",
				path: ["appPositions"],
				message: `row:${r}, col:${c} の位置が複数のアプリで使われています。`,
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
					content: "Root memo",
				},
				{
					id: "folder-A",
					name: "フォルダA",
					iconKey: "FolderIcon",
					color: "#FFC107",
					type: "folder",
				},
				{
					id: "folder-B",
					name: "フォルダB",
					iconKey: "FolderIcon",
					color: "#FF9800",
					type: "folder",
				},
				{
					id: "memo-deep",
					name: "深いメモ",
					iconKey: "StickyNote",
					color: "#FFEB3B",
					type: "memo",
					content: "三重ネスト",
				},
			],
			appPositions: {
				"app-1": { row: 0, col: 0 },
				"folder-A": { row: 0, col: 1 },
				"folder-B": { row: 1, col: 0 },
			},
			folderContents: {
				"folder-A": ["folder-B"],
				"folder-B": ["memo-deep"],
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
