"use client";

import { type Editor, EditorContent } from "@tiptap/react";
import { useEffect } from "react";
import { BoldIcon } from "./tiptap-icons/bold-icon";
import { Code2Icon } from "./tiptap-icons/code-block2-icon";
import { ItalicIcon } from "./tiptap-icons/italic-icon";
import { UnderlineIcon } from "./tiptap-icons/underline-icon";
import { Button } from "./tiptap-ui-primitive/button";
import { Toolbar, ToolbarGroup, ToolbarSeparator } from "./tiptap-ui-primitive/toolbar";

import { BlockquoteButton } from "./tiptap-ui/blockquote-button";
import { CodeBlockButton } from "./tiptap-ui/code-block-button";
import { HeadingDropdownMenu } from "./tiptap-ui/heading-dropdown-menu";
import { ListDropdownMenu } from "./tiptap-ui/list-dropdown-menu";

interface TiptapEditorProps {
	editor: Editor | null;
}

export default function TiptapEditor({ editor }: TiptapEditorProps) {
	useEffect(() => {
		if (editor?.isEditable) {
			editor.commands.focus("end");
		}
	}, [editor]);

	if (!editor) {
		return null;
	}

	return (
		<div className="flex h-full flex-col">
			<div className="sticky top-0 z-[1000000]">
				{/* <Toolbar variant="fixed">
					<ToolbarGroup>
						<HeadingDropdownMenu
							editor={editor}
							levels={[1, 2, 3]}
							hideWhenUnavailable={true}
							portal={false}
							onOpenChange={(isOpen) => console.log("Dropdown", isOpen ? "opened" : "closed")}
						/>
						<ListDropdownMenu
							editor={editor}
							types={["bulletList", "orderedList", "taskList"]}
							hideWhenUnavailable={true}
							portal={false}
							onOpenChange={(isOpen) => console.log("Dropdown opened:", isOpen)}
						/>
						<BlockquoteButton
							editor={editor}
							onToggled={() => console.log("Blockquote toggled!")}
						/>
						<CodeBlockButton editor={editor} onToggled={() => console.log("Code block toggled!")} />
					</ToolbarGroup>
					<ToolbarSeparator />
					<ToolbarGroup>
						<Button
							data-style="ghost"
							onClick={() => editor.chain().focus().toggleBold().run()}
							className={editor.isActive("bold") ? "is-active" : ""}
						>
							<BoldIcon className="tiptap-button-icon" />
						</Button>
						<Button
							data-style="ghost"
							onClick={() => editor.chain().focus().toggleItalic().run()}
							className={editor.isActive("italic") ? "is-active" : ""}
						>
							<ItalicIcon className="tiptap-button-icon" />
						</Button>
						<Button
							data-style="ghost"
							onClick={() => editor.chain().focus().toggleCode().run()}
							className={editor.isActive("code") ? "is-active" : ""}
						>
							<Code2Icon className="tiptap-button-icon" />
						</Button>
						<Button
							data-style="ghost"
							onClick={() => editor.chain().focus().toggleUnderline().run()}
							className={editor.isActive("underline") ? "is-active" : ""}
						>
							<UnderlineIcon className="tiptap-button-icon" />
						</Button>
					</ToolbarGroup>
				</Toolbar> */}
			</div>
			<EditorContent editor={editor} className="mb-[6px] h-full flex-1 pb-[6px]" />
		</div>
	);
}
