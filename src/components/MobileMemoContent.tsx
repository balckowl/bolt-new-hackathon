import { useEditor } from "@tiptap/react";
import { EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { z } from "zod";
import type { desktopStateSchema } from "../server/models/os.schema";

type Desktop = z.infer<typeof desktopStateSchema>;
type DesktopApp = Desktop["state"]["apps"][number];

type Props = {
	memo: DesktopApp;
};

export default function MobileMemoContent({ memo }: Props) {
	const editor = useEditor({
		extensions: [StarterKit],
		content: memo.content,
		editable: false,
		editorProps: {
			attributes: {
				class:
					"prose prose-sm prose-li:marker:text-black prose-p:m-0 prose-headings:m-0 prose-ul:m-0 prose-ol:m-0 prose-blockquote:m-0 prose-hr:m-0 prose-pre:m-0 m-5 focus:outline-none text-left",
			},
		},
		immediatelyRender: false,
	});

	return <EditorContent editor={editor} />;
}
