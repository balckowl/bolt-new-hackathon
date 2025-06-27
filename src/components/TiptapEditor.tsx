"use client";

import { type Editor, EditorContent, useEditor } from "@tiptap/react";

interface TiptapEditorProps {
	editor: Editor | null;
}

export default function TiptapEditor({ editor }: TiptapEditorProps) {
	if (!editor) {
		return null;
	}

	return (
		<div className="mx-auto my-4">
			<EditorContent editor={editor} />
		</div>
	);
}
