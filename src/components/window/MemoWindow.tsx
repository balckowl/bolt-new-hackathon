import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import type { MemoWindowType } from "../../types/desktop";
import TiptapEditor from "../TiptapEditor";
import { Button } from "../ui/button";

export function MemoWindow({
	window,
	onClose,
	onMinimize,
	onContentChange,
	onBringToFront,
	onPositionChange,
	onSizeChange,
}: {
	window: MemoWindowType;
	onClose: () => void;
	onMinimize: () => void;
	onContentChange: (content: string) => void;
	onBringToFront: () => void;
	onPositionChange: (position: { x: number; y: number }) => void;
	onSizeChange: (size: { width: number; height: number }) => void;
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
		extensions: [StarterKit],
		content: window.content,
		editorProps: {
			attributes: {
				class:
					"prose prose-sm prose-li:marker:text-black prose-p:m-0 prose-headings:m-0 prose-ul:m-0 prose-ol:m-0 prose-blockquote:m-0 prose-hr:m-0 prose-pre:m-0 m-5 focus:outline-none text-left",
			},
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
			className="fixed flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl"
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
			<div className="window-header flex flex-shrink-0 cursor-grab items-center justify-between border-gray-200 border-b bg-gray-50 px-4 py-2 active:cursor-grabbing">
				<div className="flex items-center space-x-2">
					<div className="flex space-x-2">
						<button
							onClick={onClose}
							className="h-3 w-3 rounded-full bg-red-500 transition-colors hover:bg-red-600"
							type="button"
						/>
						<button
							onClick={onMinimize}
							className="h-3 w-3 rounded-full bg-yellow-500 transition-colors hover:bg-yellow-600"
							type="button"
						/>
						<button
							className="h-3 w-3 rounded-full bg-green-500 transition-colors hover:bg-green-600"
							type="button"
						/>
					</div>
					<span className="ml-4 font-medium text-gray-700 text-sm">{window.title}</span>
				</div>
				<Button onClick={handleSaveMemo}>Save</Button>
			</div>

			{/* Window Content */}
			<div className="min-h-0 flex-1 overflow-y-auto ">
				<TiptapEditor editor={editor} />
			</div>

			{/* Resize Handle */}
			<div
				className="absolute right-0 bottom-0 h-4 w-4 cursor-se-resize"
				onMouseDown={handleResizeMouseDown}
			>
				<div className="absolute right-1 bottom-1 h-2 w-2 border-gray-400 border-r-2 border-b-2" />
			</div>
		</div>
	);
}
