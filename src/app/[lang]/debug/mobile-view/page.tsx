import MobileView from "@/src/components/MobileView";
import type { desktopStateSchema } from "@/src/server/models/os.schema";
import type { z } from "zod";

const data: z.infer<typeof desktopStateSchema> = {
	state: {
		apps: [
			{
				id: "app-1",
				name: "Intro",
				iconKey: "StickyNote",
				color: "#FFEB3B",
				type: "memo",
				content:
					"<p>Thank you for using this site! 🎉✨<br>You can find instructions on how to use it under <strong>Instructions</strong> in the menu bar.</p>",
			},
			{
				id: "app-1758189009016",
				name: "youtu.be",
				iconKey: "Globe",
				color: "#FFEB3B",
				type: "website",
				url: "https://youtu.be/qwj-NhPJBeI?si=QCDELMP8eYGPPN6N",
				favicon: "https://www.google.com/s2/favicons?domain=youtu.be&sz=64",
			},
			{
				id: "app-1758189047837",
				name: "youtube.com",
				iconKey: "Globe",
				color: "#FFEB3B",
				type: "website",
				url: 'https://www.youtube.com/embed/qwj-NhPJBeI?si=QCDELMP8eYGPPN6N" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
				favicon: "https://www.google.com/s2/favicons?domain=www.youtube.com&sz=64",
			},
			{
				id: "folder-1758202547180",
				name: "Folder 1",
				iconKey: "FolderIcon",
				color: "#FFEB3B",
				type: "folder",
			},
			{
				id: "folder-1758206879097",
				name: "おはようございます",
				iconKey: "FolderIcon",
				color: "#FFEB3B",
				type: "folder",
			},
			{
				id: "memo-1758206884180",
				name: "Memo 2",
				iconKey: "StickyNote",
				color: "#FFEB3B",
				type: "memo",
				content: "<p>supabase</p><p></p><p>cdsmocdmpvofd</p><p></p><h2>hello</h2>",
			},
			{
				id: "app-1758211109205",
				name: "supabase",
				iconKey: "Globe",
				color: "#FFEB3B",
				type: "website",
				url: "https://www.youtube.com/watch?v=ihcyqbFxC_4&list=RDB-E7pbzQwO0&index=7",
				favicon: "https://www.google.com/s2/favicons?domain=www.youtube.com&sz=64",
			},
		],
		appPositions: {
			"app-1758189047837": { row: 0, col: 1 },
			"app-1758211109205": { row: 2, col: 0 },
			"memo-1758206884180": { row: 0, col: 0 },
			"folder-1758202547180": { row: 0, col: 3 },
			"folder-1758206879097": { row: 0, col: 2 },
		},
		folderContents: {
			"folder-1758202547180": ["app-1758189009016"],
			"folder-1758206879097": ["app-1"],
		},
	},
	isPublic: true,
	background: "SUNSET",
	font: "INTER",
	isEdit: true,
	currentUsername: "くぼやまあみ",
	currentUserOsName: "ospace",
	currentUserIcon:
		"https://lh3.googleusercontent.com/a/ACg8ocJTgfVLB0I4OsuzB9rM49xIWdf-94lqoJoPT2CK3GW5snH1dQ=s96-c",
};

export default function Page() {
	return (
		<div>
			<MobileView desktop={data} />
		</div>
	);
}
