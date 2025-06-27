import { FolderIcon, Globe, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { AppIcon, FolderWindowType } from "../../types/desktop";

export function FolderWindow({
	window,
	folderContents,
	apps,
	onClose,
	onMinimize,
	onBringToFront,
	onRemoveApp,
	onAppClick,
	onPositionChange,
	onSizeChange,
}: {
	window: FolderWindowType;
	folderContents: string[];
	apps: AppIcon[];
	onClose: () => void;
	onMinimize: () => void;
	onBringToFront: () => void;
	onRemoveApp: (appId: string) => void;
	onAppClick: (app: AppIcon) => void;
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

	const renderAppIcon = (app: AppIcon) => {
		if (app.type === "website" && app.favicon) {
			return (
				<div className="relative h-6 w-6">
					<Image
						src={app.favicon}
						alt={app.name}
						width={28}
						height={28}
						className="h-6 w-6 rounded-sm"
						onError={(e) => {
							const target = e.target as HTMLImageElement;
							target.style.display = "none";
							const parent = target.parentElement;
							if (parent) {
								const fallbackIcon = parent.querySelector(".fallback-icon");
								if (fallbackIcon) {
									fallbackIcon.classList.remove("hidden");
								}
							}
						}}
					/>
					<Globe
						size={28}
						className="fallback-icon absolute inset-0 hidden text-white drop-shadow-sm"
					/>
				</div>
			);
		}
		return <app.icon size={24} className="text-white drop-shadow-sm" />;
	};

	const folderApps = folderContents
		.map((appId) => apps.find((app) => app.id === appId))
		.filter(Boolean) as AppIcon[];

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
				<div className="text-gray-500 text-xs">
					{folderApps.length} item
					{folderApps.length !== 1 ? "s" : ""}
				</div>
			</div>

			{/* Folder Content */}
			<div className="h-full flex-1 overflow-auto p-4" style={{ height: "calc(100% - 50px)" }}>
				{folderApps.length === 0 ? (
					<div className="flex h-full items-center justify-center text-center text-gray-500">
						<div>
							<FolderIcon size={48} className="mx-auto mb-4 text-gray-300" />
							<p className="text-sm">This folder is empty</p>
							<p className="mt-1 text-xs">Drag apps here to organize them</p>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-6 gap-4">
						{folderApps.map((app) => (
							<div key={app.id} className="group flex flex-col items-center">
								<div className="relative">
									<div
										onClick={() => onAppClick(app)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												onAppClick(app);
											}
										}}
										className={`relative h-12 w-12 rounded-xl ${app.color}shadow-md flex cursor-pointer items-center justify-center border border-white/20 transition-all duration-200 hover:shadow-lg group-hover:scale-110 `}
									>
										{renderAppIcon(app)}
										{app.type === "website" && app.favicon && (
											<Globe size={24} className="hidden text-white drop-shadow-sm" />
										)}
										<div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-white/10" />
									</div>
									<button
										onClick={(e) => {
											e.stopPropagation();
											onRemoveApp(app.id);
										}}
										type="button"
										className="-top-1 -right-1 absolute flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs opacity-0 transition-colors hover:bg-red-600 group-hover:opacity-100"
									>
										<X size={12} />
									</button>
								</div>
								<div className="mt-1 max-w-full truncate text-center font-medium text-gray-700 text-xs">
									{app.name}
								</div>
							</div>
						))}
					</div>
				)}
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
