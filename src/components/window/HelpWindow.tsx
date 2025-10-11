import type { FontOptionType } from "@/prisma/prisma/zod";
import { Currency, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { HelpWindowType } from "../../types/desktop";
import WindowHeader from "./WindowHeader";

export function HelpWindow({
	window,
	onClose,
	// onMinimize,
	onBringToFront,
	onPositionChange,
	onSizeChange,
	getFontStyle,
	currentFont,
}: {
	window: HelpWindowType;
	onClose: () => void;
	// onMinimize: () => void;
	onBringToFront: () => void;
	onPositionChange: (position: { x: number; y: number }) => void;
	onSizeChange: (size: { width: number; height: number }) => void;
	getFontStyle: (newFont: FontOptionType) => void;
	currentFont: FontOptionType;
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

	return (
		<div
			className="fixed flex flex-col overflow-hidden rounded-2xl shadow-2xl"
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
			<WindowHeader title="Introductions" getFontStyle={getFontStyle} currentFont={currentFont}>
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
			<div className="h-[calc(100%-40px)] flex-1 overflow-y-auto bg-white/90 px-[6px] pb-[6px]">
				<div className="h-full rounded-xl bg-white">
					<h2 className="mb-4 pt-4 pl-2 font-extrabold text-2xl tracking-tight">Instructions</h2>
					<ol className="list-decimal space-y-6 pl-7 text-base text-gray-800">
						<li>
							<span className="font-semibold text-blue-700">Notepad</span> allows you to write notes
							in{" "}
							<span className="rounded bg-gray-200 px-2 py-0.5 font-mono text-blue-800 text-sm">
								Markdown
							</span>{" "}
							format.
							<br />
							<span className="mt-1 block text-gray-500 text-xs italic">
								Example: Try leaving your self-introduction or study notes.
							</span>
						</li>
						<li>
							You can convert your{" "}
							<span className="font-semibold text-blue-700">favorite websites</span> into apps and
							open them in your OS.
							<br />
							<span className="mt-1 block text-gray-500 text-xs italic">
								Example: Register frequently used services or reference sites.
							</span>
						</li>
						<li>
							By using <span className="font-semibold text-blue-700">folders</span>, you can
							organize the apps you have created.
							<br />
							<span className="mt-1 block text-gray-500 text-xs italic">
								Example: Group your apps by theme for better organization.
							</span>
						</li>
					</ol>
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
