import { Placeholder } from "@tiptap/extensions";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { MemoWindowType } from "../../types/desktop";
import TiptapEditor from "../TiptapEditor";
import WindowHeader from "./WindowHeader";

export function MemoWindow({
	window,
	onClose,
	onMinimize,
	onContentChange,
	onBringToFront,
	onPositionChange,
	onSizeChange,
	isEditable = false,
}: {
	window: MemoWindowType;
	onClose: () => void;
	onMinimize: () => void;
	onContentChange: (content: string) => void;
	onBringToFront: () => void;
	onPositionChange: (position: { x: number; y: number }) => void;
	onSizeChange: (size: { width: number; height: number }) => void;
	isEditable: boolean;
}) {
	const [isDragging, setIsDragging] = useState(false);
	const [isResizing, setIsResizing] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [resizeStart, setResizeStart] = useState({
		x: 0,
		y: 0,
		width: 0,
		height: 0,
	});

	const editor = useEditor({
		immediatelyRender: true,
		extensions: [
			StarterKit,
			Placeholder.configure({
				placeholder: "Write something ...",
			}),
		],
		content: window.content,
		editable: isEditable,
		editorProps: {
			attributes: {
				class:
					"prose prose-sm prose-li:marker:text-black prose-p:m-0 prose-headings:m-0 prose-ul:m-0 prose-ol:m-0 prose-blockquote:m-0 prose-hr:m-0 prose-pre:m-0 min-h-full p-5 focus:outline-none text-left cursor-text",
			},
		},
		onCreate: ({ editor }) => {
			if (isEditable) {
				editor.commands.focus("end");
			}
		},
		onUpdate: ({ editor }) => {
			const markdown = editor.getHTML();
			onContentChange(markdown);
		},
	});

	const handleMouseDown = (e: React.MouseEvent) => {
		if (
			e.target === e.currentTarget ||
			(e.target as HTMLElement).classList.contains("window-header")
		) {
			setIsDragging(true);
			setDragStart({
				x: e.clientX - window.position.x,
				y: e.clientY - window.position.y,
			});
			onBringToFront();
		}
	};

	const handleContentAreaMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target !== e.currentTarget) {
			return;
		}
		e.stopPropagation();
		onBringToFront();
		if (!isEditable) {
			return;
		}
		editor?.chain().focus("end").run();
	};

	const handleResizeMouseDown = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsResizing(true);
		setResizeStart({
			x: e.clientX,
			y: e.clientY,
			width: window.size.width,
			height: window.size.height,
		});
		onBringToFront();
	};

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (isDragging) {
				onPositionChange({
					x: e.clientX - dragStart.x,
					y: e.clientY - dragStart.y,
				});
			} else if (isResizing) {
				const newWidth = Math.max(300, resizeStart.width + (e.clientX - resizeStart.x));
				const newHeight = Math.max(200, resizeStart.height + (e.clientY - resizeStart.y));
				onSizeChange({
					width: newWidth,
					height: newHeight,
				});
			}
		};

		const handleMouseUp = () => {
			setIsDragging(false);
			setIsResizing(false);
		};

		if (isDragging || isResizing) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging, isResizing, dragStart, resizeStart, onPositionChange, onSizeChange]);

	const handleSaveMemo = () => {
		//todo: save to db
		onClose();
	};
	return (
		<div
			className="fixed flex min-w-[550px] flex-col overflow-hidden rounded-2xl shadow-2xl"
			style={{
				left: window.position.x,
				top: window.position.y,
				width: window.size.width,
				height: window.size.height,
				zIndex: window.zIndex,
				cursor: isDragging ? "grabbing" : "default",
			}}
			onMouseDown={handleMouseDown}
		>
			{/* Window Header */}
			<WindowHeader title={window.title}>
				{/* クローズ */}
				<button
					onMouseDown={(e) => e.stopPropagation()}
					onClick={onClose}
					className="relative flex h-6 w-8 items-center justify-center rounded-lg font-bold text-black transition-all duration-200 hover:bg-gray-300/60"
					type="button"
					title="Close"
					aria-label="Close"
				>
					<X size={17} strokeWidth={2.5} />
				</button>
			</WindowHeader>

			{/* Window Content */}
			<div className="flex h-[calc(100%-40px)] flex-1 flex-col overflow-y-auto bg-white/90 px-[6px] pb-[6px]">
				<div
					className="flex h-full flex-1 flex-col overflow-y-auto rounded-xl bg-white"
					onMouseDown={handleContentAreaMouseDown}
				>
					<TiptapEditor editor={editor} />
				</div>
			</div>

			{/* Resize Handle */}
			<div
				className="absolute right-1 bottom-1 h-4 w-4 cursor-se-resize"
				onMouseDown={handleResizeMouseDown}
			>
				<div className="absolute right-2 bottom-2 h-2 w-2 rounded-br-sm border-black border-r-2 border-b-2" />
			</div>
		</div>
	);
}
