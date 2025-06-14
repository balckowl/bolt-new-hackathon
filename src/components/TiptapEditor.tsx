"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface TiptapEditorProps {
	content?: string;
	onContentChange?: (content: string) => void;
}

export default function TiptapEditor({ content = "", onContentChange }: TiptapEditorProps) {
	const editor = useEditor({
		extensions: [StarterKit],
		content,
		editorProps: {
			attributes: {
				class:
					"prose prose-sm prose-li:marker:text-black prose-p:m-0 prose-headings:m-0 prose-ul:m-0 prose-ol:m-0 prose-blockquote:m-0 prose-hr:m-0 prose-pre:m-0 m-5 focus:outline-none text-left",
			},
		},
	});

	if (editor) {
		editor.on("update", () => {
			onContentChange?.(editor.getText());
		});
	}
	if (!editor) {
		return null;
	}

	return (
		<div className="mx-auto my-4 p-4 ">
			<EditorContent editor={editor} />
		</div>
	);
}
