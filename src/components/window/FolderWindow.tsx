import { Diamond, DiamondIcon, FolderIcon, Globe, Sparkle, Square, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { DragEvent } from "react";
import type { AppIcon, FolderWindowType } from "../../types/desktop";
import WindowHeader from "./WindowHeader";

const FOLDER_GRID_COLS = 4;
const MIN_VISIBLE_ROWS = 3;

export function FolderWindow({
	window,
	folderContents,
	apps,
	allFolderContents,
	desktopBackground,
	brightness,
	isEditable,
	canDropExternal,
	onExternalDrop,
	onClose,
	onMinimize,
	onBringToFront,
	onRemoveApp,
	onAppClick,
	onAppContextMenu,
	onEmptyAreaContextMenu,
	onAppDragStart,
	onAppDragEnd,
	onAppDrop,
	onDropIntoFolder,
	onPositionChange,
	onSizeChange,
	failedFavicons,
	onFaviconError,
}: {
	window: FolderWindowType;
	folderContents: string[];
	apps: AppIcon[];
	allFolderContents: Map<string, string[]>;
	desktopBackground?: string;
	brightness: number;
	isEditable: boolean;
	canDropExternal: boolean;
	onExternalDrop: () => void;
	onClose: () => void;
	onMinimize: () => void;
	onBringToFront: () => void;
	onRemoveApp: (appId: string) => void;
	onAppClick: (app: AppIcon) => void;
	onAppContextMenu: (e: React.MouseEvent, app: AppIcon, folderId: string) => void;
	onEmptyAreaContextMenu: (e: React.MouseEvent, folderId: string) => void;
	onAppDragStart: (e: React.DragEvent, appId: string, folderId: string) => void;
	onAppDragEnd: () => void;
	onAppDrop: (folderId: string, dropIndex: number) => void;
	onDropIntoFolder: (targetFolderId: string, parentFolderId: string) => void;
	onPositionChange: (position: { x: number; y: number }) => void;
	onSizeChange: (size: { width: number; height: number }) => void;
	failedFavicons: Record<string, string | null>;
	onFaviconError: (appId: string, favicon?: string) => void;
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
	const [isExternalDragOver, setIsExternalDragOver] = useState(false);

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
			const failedSrc = failedFavicons[app.id] ?? null;
			const currentSrc = app.favicon ?? null;

			if (failedSrc !== currentSrc) {
				return (
					<div className="relative flex items-center justify-center">
						<Image
							key={`${app.id}-${app.favicon}`}
							src={app.favicon}
							alt={app.name}
							width={30}
							height={30}
							className="pointer-events-none relative z-10 rounded-sm"
							onError={() => onFaviconError(app.id, app.favicon)}
						/>
					</div>
				);
			}

			return (
				<Sparkle size={30} fill="black" color="color" strokeWidth={0.8} className="relative z-10" />
			);
		}
		return <app.icon size={30} className="relative z-10 text-black drop-shadow-sm" />;
	};

	const folderApps = folderContents
		.map((appId) => apps.find((app) => app.id === appId))
		.filter(Boolean) as AppIcon[];

	const getFolderAppCount = (folderId: string) => allFolderContents.get(folderId)?.length ?? 0;

	const totalCells = Math.max(folderApps.length, FOLDER_GRID_COLS * MIN_VISIBLE_ROWS);
	const totalRows = Math.ceil(totalCells / FOLDER_GRID_COLS);

	const resolveBackgroundStyle = () => {
		const backgroundValue =
			desktopBackground ?? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

		if (backgroundValue.startsWith("http")) {
			return {
				backgroundImage: `url(${backgroundValue})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
			} as const;
		}

		return {
			background: backgroundValue,
		} as const;
	};

	const handleExternalDragEnter = (e: DragEvent<HTMLDivElement>) => {
		if (!isEditable || !canDropExternal) return;
		e.preventDefault();
		setIsExternalDragOver(true);
	};

	const handleExternalDragOver = (e: DragEvent<HTMLDivElement>) => {
		if (!isEditable || !canDropExternal) return;
		e.preventDefault();
	};

	const handleExternalDragLeave = (e: DragEvent<HTMLDivElement>) => {
		if (!isEditable || !canDropExternal) return;
		const related = e.relatedTarget as Node | null;
		if (related && (e.currentTarget as Node).contains(related)) return;
		setIsExternalDragOver(false);
	};

	const handleExternalDropInternal = (e: DragEvent<HTMLDivElement>) => {
		if (!isEditable || !canDropExternal) return;
		e.preventDefault();
		setIsExternalDragOver(false);
		onExternalDrop();
	};

	return (
		<div
			className="fixed min-w-[550px] overflow-hidden rounded-2xl shadow-2xl"
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

			{/* Folder Content */}
			<div className="h-[calc(100%-40px)] flex-1 overflow-auto bg-white/90 px-[6px] pb-[6px] backdrop-blur-lg">
				<div
					className={`relative h-full rounded-xl py-4 transition ${
						isExternalDragOver ? "ring-2 ring-white/70" : ""
					}`}
					style={resolveBackgroundStyle()}
					onDragEnter={handleExternalDragEnter}
					onDragOver={handleExternalDragOver}
					onDragLeave={handleExternalDragLeave}
					onDrop={handleExternalDropInternal}
				>
					<div
						className="pointer-events-none absolute inset-0 rounded-xl"
						style={{ backgroundColor: `rgba(0, 0, 0, ${brightness})` }}
						aria-hidden="true"
					/>
					{folderApps.length === 0 ? (
						<div
							className="flex h-full items-center justify-center text-center"
							onContextMenu={(e) => onEmptyAreaContextMenu(e, window.id)}
						>
							<div>
								<FolderIcon size={48} className="mx-auto mb-4 text-white" />
								<p className="text-white">This folder is empty.</p>
								{isEditable && (
									<p className="text-sm text-white">Drag apps here to organize them.</p>
								)}
							</div>
						</div>
					) : (
						<div
							className="grid gap-0"
							onContextMenu={(e) => {
								if (e.target === e.currentTarget) {
									onEmptyAreaContextMenu(e, window.id);
								}
							}}
							style={{
								gridTemplateColumns: `repeat(${FOLDER_GRID_COLS}, minmax(0, 1fr))`,
								gridAutoRows: "minmax(110px, 1fr)",
							}}
						>
							{Array.from({ length: totalRows * FOLDER_GRID_COLS }).map((_, index) => {
								const app = folderApps[index];
								const cellKey = app ? `folder-cell-${app.id}` : `folder-cell-empty-${index}`;

								return (
									<div
										key={cellKey}
										// biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
										className={`group relative flex flex-col items-center justify-center`}
										onDragOver={(e) => {
											if (!isEditable || !canDropExternal) return;
											e.preventDefault();
											e.stopPropagation();
										}}
										onDrop={(e) => {
											if (!isEditable || !canDropExternal) return;
											e.preventDefault();
											e.stopPropagation();
											onAppDrop(window.id, index);
										}}
										onContextMenu={(e) => {
											if (app) {
												onAppContextMenu(e, app, window.id);
											} else {
												onEmptyAreaContextMenu(e, window.id);
											}
										}}
									>
										{app && (
											<div
												className="group flex cursor-pointer flex-col items-center"
												draggable={isEditable}
												onDragStart={(e) => onAppDragStart(e, app.id, window.id)}
												onDragEnd={onAppDragEnd}
												onClick={() => onAppClick(app)}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ") {
														e.preventDefault();
														onAppClick(app);
													}
												}}
											>
												<div className="relative mb-[6px]">
													<div
														className="relative flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg"
														onDragOver={(e) => {
															if (!isEditable || !canDropExternal || app.type !== "folder") return;
															e.preventDefault();
															e.stopPropagation();
														}}
														onDrop={(e) => {
															if (!isEditable || !canDropExternal || app.type !== "folder") return;
															e.preventDefault();
															e.stopPropagation();
															onDropIntoFolder(app.id, window.id);
														}}
													>
														{renderAppIcon(app)}
														{app.type === "website" && app.favicon && (
															<Globe size={30} className="hidden text-black drop-shadow-sm" />
														)}
														{app.type === "folder" && getFolderAppCount(app.id) > 0 && (
															<div className="-top-[6px] -right-[6px] absolute z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 font-bold text-white text-xs">
																{getFolderAppCount(app.id)}
															</div>
														)}
														<div className="absolute inset-0 rounded-2xl bg-white" />
													</div>
												</div>
												<div className="mt-1 w-full px-2 text-center font-medium text-white text-xs">
													{app.name}
												</div>
											</div>
										)}
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>

			{/* Resize Handle */}
			<div
				className="absolute right-1 bottom-1 h-4 w-4 cursor-se-resize"
				onMouseDown={handleResizeMouseDown}
			>
				<div className="absolute right-2 bottom-2 h-2 w-2 rounded-br-sm border-white border-r-2 border-b-2" />
			</div>
		</div>
	);
}
