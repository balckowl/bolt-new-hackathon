"use client";

import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import { useEffect } from "react";

interface TiptapEditorProps {
	editor: Editor | null;
}

export default function TiptapEditor({ editor }: TiptapEditorProps) {
	useEffect(() => {
		if (editor) {
			editor.commands.focus();
		}
	}, [editor]);

	if (!editor) {
		return null;
	}

	return (
		<div className="mx-auto my-4">
			<EditorContent editor={editor} />
		</div>
	);
}
