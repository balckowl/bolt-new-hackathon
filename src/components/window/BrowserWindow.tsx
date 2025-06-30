import { SquareArrowOutUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { BrowserWindowType } from "../../types/desktop";

export function BrowserWindow({
	window,
	onClose,
	onMinimize,
	onBringToFront,
	onPositionChange,
	onSizeChange,
}: {
	window: BrowserWindowType;
	onClose: () => void;
	onMinimize: () => void;
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
				const newWidth = Math.max(400, resizeStart.width + (e.clientX - resizeStart.x));
				const newHeight = Math.max(300, resizeStart.height + (e.clientY - resizeStart.y));
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

	return (
		<div
			className="fixed overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl"
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
			<div className="window-header flex cursor-grab items-center justify-between border-gray-200 border-b bg-gray-50 px-4 py-2 active:cursor-grabbing">
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
				<div className="flex items-center space-x-2">
					<a
						href={window.url}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 rounded bg-gray-100 px-2 py-1 text-gray-500 text-xs"
					>
						{window.url}
						<SquareArrowOutUpRight size={12} />
					</a>
				</div>
			</div>

			{/* Browser Content */}
			<div className="h-full flex-1">
				<iframe
					src={window.url}
					className="h-full w-full border-0"
					style={{
						height: "calc(100% - 50px)",
					}}
					title={window.title}
				/>
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
