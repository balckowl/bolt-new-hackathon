"use client";

import { backgroundOptions } from "@/src/components/BackgroundSelector";
import { CommonDialog } from "@/src/components/CommonDialog";
import { ContextMenu } from "@/src/components/ContextMenu";
import { MenuBar } from "@/src/components/MenuBar";
import { Button } from "@/src/components/ui/button";
import { HelpWindow } from "@/src/components/window/HelpWindow";
import { checkUrlExists } from "@/src/lib/favicon-utils";
import { hono } from "@/src/lib/hono-client";
import type { desktopStateSchema } from "@/src/server/models/os.schema";
import { FolderIcon, Globe, StickyNote } from "lucide-react";
import * as Icons from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type z from "zod";
import { BrowserWindow } from "../components/window/BrowserWindow";
import { FolderWindow } from "../components/window/FolderWindow";
import { MemoWindow } from "../components/window/MemoWindow";
import type {
	AppIcon,
	AppUrlDialog,
	BrowserWindowType,
	ContextMenuType,
	EditDialog,
	FolderNameDialog,
	FolderWindowType,
	GridPosition,
	HelpWindowType,
	MemoNameDialog,
	MemoWindowType,
} from "../types/desktop";

type Props = {
	desktop: z.infer<typeof desktopStateSchema>;
	osName: string;
};

const GRID_COLS = 6;
const GRID_ROWS = 10;

export default function MacosDesktop({ desktop, osName }: Props) {
	const [apps, setApps] = useState<AppIcon[]>([]);
	const [appPositions, setAppPositions] = useState<Map<string, GridPosition>>(new Map());
	const [draggedApp, setDraggedApp] = useState<string | null>(null);
	const [draggedOver, setDraggedOver] = useState<GridPosition | null>(null);
	const [contextMenu, setContextMenu] = useState<ContextMenuType>({
		visible: false,
		x: 0,
		y: 0,
		position: null,
	});
	const [memoWindows, setMemoWindows] = useState<MemoWindowType[]>([]);
	const [browserWindows, setBrowserWindows] = useState<BrowserWindowType[]>([]);
	const [folderWindows, setFolderWindows] = useState<FolderWindowType[]>([]);
	const [nextzIndex, setNextzIndex] = useState(1000);
	const [memoCounter, setMemoCounter] = useState(2);
	const [folderCounter, setFolderCounter] = useState(1);
	const [positionsInitialized, setPositionsInitialized] = useState(false);
	const [memoNameDialog, setMemoNameDialog] = useState<MemoNameDialog>({
		visible: false,
		position: null,
	});
	const [appUrlDialog, setAppUrlDialog] = useState<AppUrlDialog>({
		visible: false,
		position: null,
	});
	const [folderNameDialog, setFolderNameDialog] = useState<FolderNameDialog>({
		visible: false,
		position: null,
	});
	const [editDialog, setEditDialog] = useState<EditDialog>({
		visible: false,
		app: null,
		newName: "",
		newUrl: "",
	});
	const [memoNameInput, setMemoNameInput] = useState("");
	const [appUrlInput, setAppUrlInput] = useState("");
	const [folderNameInput, setFolderNameInput] = useState("");
	const [isLoadingApp, setIsLoadingApp] = useState(false);
	const [currentTime, setCurrentTime] = useState(new Date());
	const [background, setBackground] = useState("linear-gradient(135deg, #667eea 0%, #764ba2 100%)");
	const [folderContents, setFolderContents] = useState<Map<string, string[]>>(new Map());
	const [draggedOverFolder, setDraggedOverFolder] = useState<string | null>(null);

	// help window
	const [helpWindow, setHelpWindow] = useState<HelpWindowType>({
		visible: false,
		content: "welcome",
		position: { x: 50, y: 50 },
		size: { width: 650, height: 600 },
		isMinimized: false,
		zIndex: nextzIndex + 1000,
	});

	//差分検知用の初期値
	const [originalApps, setOriginalApps] = useState<AppIcon[]>([]);
	const [originalAppPositions, setOriginalAppPositions] = useState<Map<string, GridPosition>>(
		new Map(),
	);

	// public or private
	const [isPublic, setIsPublic] = useState(false);

	// isEdit
	const isEdit = desktop.isEdit ?? false;

	const dragSourceRef = useRef<GridPosition | null>(null);

	// Update time every second
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	//initialize app positions
	useEffect(() => {
		if (!positionsInitialized && apps.length === 0) {
			const positionsMap = new Map<string, { row: number; col: number }>(
				Object.entries(desktop.state.appPositions),
			);
			const responseApps = desktop.state.apps.map((app) => ({
				...app,
				id: app.id,
				name: app.name,
				icon: Icons[app.iconKey],
				iconKey: app.iconKey,
				color: app.color,
				type: app.type,
			}));
			setAppPositions(positionsMap);
			setOriginalAppPositions(positionsMap);
			setApps(responseApps);
			setOriginalApps(responseApps);

			// folderContents の初期化
			const fcMap = new Map<string, string[]>(Object.entries(desktop.state.folderContents));
			setFolderContents(fcMap);

			setPositionsInitialized(true);
			setIsPublic(desktop.isPublic);
			if (desktop.background) {
				const backgroundImg = backgroundOptions.find((opt) => opt.name === desktop.background);
				if (!backgroundImg) return;
				setBackground(backgroundImg.value);
			}
		}
	}, [desktop, apps.length, positionsInitialized]);

	// Close context menu and dialogs when clicking elsewhere
	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			// Don't close if clicking inside the dialog or context menu
			const target = e.target as HTMLElement;
			if (
				target.closest(".memo-dialog") ||
				target.closest(".app-dialog") ||
				target.closest(".folder-dialog") ||
				target.closest(".edit-dialog") ||
				target.closest(".context-menu")
			) {
				return;
			}

			setContextMenu({
				visible: false,
				x: 0,
				y: 0,
				position: null,
			});
			setMemoNameDialog({
				visible: false,
				position: null,
			});
			setAppUrlDialog({
				visible: false,
				position: null,
			});
			setFolderNameDialog({
				visible: false,
				position: null,
			});
			setEditDialog({
				visible: false,
				app: null,
				newName: "",
				newUrl: "",
			});
		};

		document.addEventListener("click", handleClick);
		return () => document.removeEventListener("click", handleClick);
	}, []);

	const getAppAtPosition = (row: number, col: number): AppIcon | null => {
		for (const [appId, position] of appPositions.entries()) {
			if (position.row === row && position.col === col) {
				return apps.find((app) => app.id === appId) || null;
			}
		}
		return null;
	};

	const handleDragStart = (e: React.DragEvent, appId: string) => {
		if (!isEdit) return;
		setDraggedApp(appId);
		const position = appPositions.get(appId);
		if (position) {
			dragSourceRef.current = position;
		}
		e.dataTransfer.effectAllowed = "move";
	};

	const handleDragEnd = () => {
		setDraggedApp(null);
		setDraggedOver(null);
		setDraggedOverFolder(null);
		dragSourceRef.current = null;
	};

	const handleDragOver = (e: React.DragEvent, row: number, col: number) => {
		e.preventDefault();
		setDraggedOver({ row, col });

		// Check if we're dragging over a folder
		const targetApp = getAppAtPosition(row, col);
		if (targetApp && targetApp.type === "folder") {
			setDraggedOverFolder(targetApp.id);
		} else {
			setDraggedOverFolder(null);
		}

		e.dataTransfer.dropEffect = "move";
	};

	const handleDragLeave = () => {
		setDraggedOver(null);
		setDraggedOverFolder(null);
	};

	const handleDrop = (e: React.DragEvent, targetRow: number, targetCol: number) => {
		if (!isEdit) return;
		e.preventDefault();

		if (!draggedApp || !dragSourceRef.current) return;

		const newPositions = new Map(appPositions);
		const targetApp = getAppAtPosition(targetRow, targetCol);

		// If dropping on a folder, add the app to the folder
		if (targetApp && targetApp.type === "folder") {
			const newFolderContents = new Map(folderContents);
			const currentContents = newFolderContents.get(targetApp.id) || [];

			// Add the dragged app to the folder
			newFolderContents.set(targetApp.id, [...currentContents, draggedApp]);
			setFolderContents(newFolderContents);

			// Remove the app from its current position
			newPositions.delete(draggedApp);
			setAppPositions(newPositions);
		} else if (targetApp) {
			// Swap positions
			newPositions.set(draggedApp, {
				row: targetRow,
				col: targetCol,
			});
			newPositions.set(targetApp.id, dragSourceRef.current);
			setAppPositions(newPositions);
		} else {
			// Move to empty cell
			newPositions.set(draggedApp, {
				row: targetRow,
				col: targetCol,
			});
			setAppPositions(newPositions);
		}

		setDraggedOver(null);
		setDraggedOverFolder(null);
	};

	const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
		if (isEdit === false) return;
		e.preventDefault();
		e.stopPropagation();
		const existingApp = getAppAtPosition(row, col);

		setContextMenu({
			visible: true,
			x: e.clientX,
			y: e.clientY,
			position: { row, col },
			existingApp,
		});
	};

	const showMemoNameDialog = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		setMemoNameDialog({
			visible: true,
			position: contextMenu.position,
		});
		setMemoNameInput(`Memo ${memoCounter}`);
		setContextMenu({
			visible: false,
			x: 0,
			y: 0,
			position: null,
		});
	};

	const showAppUrlDialog = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		setAppUrlDialog({
			visible: true,
			position: contextMenu.position,
		});
		setAppUrlInput("");
		setContextMenu({
			visible: false,
			x: 0,
			y: 0,
			position: null,
		});
	};

	const showFolderNameDialog = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		setFolderNameDialog({
			visible: true,
			position: contextMenu.position,
		});
		setFolderNameInput(`Folder ${folderCounter}`);
		setContextMenu({
			visible: false,
			x: 0,
			y: 0,
			position: null,
		});
	};

	const showEditDialog = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!contextMenu.existingApp) return;

		setEditDialog({
			visible: true,
			app: contextMenu.existingApp,
			newName: contextMenu.existingApp.name,
			newUrl: contextMenu.existingApp.url || "",
		});
		setContextMenu({
			visible: false,
			x: 0,
			y: 0,
			position: null,
		});
	};

	const deleteApp = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!contextMenu.existingApp) return;

		const appToDelete = contextMenu.existingApp;

		// Remove from apps array
		setApps((prev) => prev.filter((app) => app.id !== appToDelete.id));

		// Remove from positions
		setAppPositions((prev) => {
			const newPositions = new Map(prev);
			newPositions.delete(appToDelete.id);
			return newPositions;
		});

		// Remove from folder contents if it's in any folder
		setFolderContents((prev) => {
			const newContents = new Map(prev);
			for (const [folderId, contents] of newContents.entries()) {
				const filteredContents = contents.filter((id) => id !== appToDelete.id);
				newContents.set(folderId, filteredContents);
			}
			return newContents;
		});

		// Close any open windows for this app
		if (appToDelete.type === "memo") {
			setMemoWindows((prev) => prev.filter((w) => w.id !== appToDelete.id));
		} else if (appToDelete.type === "website") {
			setBrowserWindows((prev) => prev.filter((w) => w.id !== appToDelete.id));
		} else if (appToDelete.type === "folder") {
			setFolderWindows((prev) => prev.filter((w) => w.id !== appToDelete.id));
			// Move folder contents back to desktop
			const contents = folderContents.get(appToDelete.id) || [];
			if (contents.length > 0) {
				const newPositions = new Map(appPositions);
				for (const appId of contents) {
					const emptyPosition = findNextEmptyPosition();
					if (emptyPosition) {
						newPositions.set(appId, emptyPosition);
					}
				}
				setAppPositions(newPositions);
			}
			// Remove folder from folderContents
			setFolderContents((prev) => {
				const newContents = new Map(prev);
				newContents.delete(appToDelete.id);
				return newContents;
			});
		}

		setContextMenu({
			visible: false,
			x: 0,
			y: 0,
			position: null,
		});
	};

	const saveEdit = () => {
		if (!editDialog.app || !editDialog.newName.trim()) return;

		// Update the app
		setApps((prev) =>
			prev.map((app) =>
				app.id === editDialog.app?.id
					? {
							...app,
							name: editDialog.newName.trim(),
							...(app.type === "website" && editDialog.newUrl
								? {
										url: editDialog.newUrl,
									}
								: {}),
						}
					: app,
			),
		);

		// Update any open windows
		if (editDialog.app.type === "memo") {
			setMemoWindows((prev) =>
				prev.map((w) =>
					w.id === editDialog.app?.id
						? {
								...w,
								title: editDialog.newName.trim(),
							}
						: w,
				),
			);
		} else if (editDialog.app.type === "website") {
			setBrowserWindows((prev) =>
				prev.map((w) =>
					w.id === editDialog.app?.id
						? {
								...w,
								title: editDialog.newName.trim(),
								...(editDialog.newUrl
									? {
											url: editDialog.newUrl,
										}
									: {}),
							}
						: w,
				),
			);
		} else if (editDialog.app.type === "folder") {
			setFolderWindows((prev) =>
				prev.map((w) =>
					w.id === editDialog.app?.id
						? {
								...w,
								title: editDialog.newName.trim(),
							}
						: w,
				),
			);
		}

		setEditDialog({
			visible: false,
			app: null,
			newName: "",
			newUrl: "",
		});
	};

	const cancelEdit = () => {
		setEditDialog({
			visible: false,
			app: null,
			newName: "",
			newUrl: "",
		});
	};

	const findNextEmptyPosition = (): GridPosition | null => {
		for (let row = 0; row < GRID_ROWS; row++) {
			for (let col = 0; col < GRID_COLS; col++) {
				if (!getAppAtPosition(row, col)) {
					return { row, col };
				}
			}
		}
		return null;
	};

	const createMemoWithName = () => {
		if (!memoNameDialog.position || !memoNameInput.trim()) return;

		const memoId = `memo-${Date.now()}`;
		const memoApp: AppIcon = {
			id: memoId,
			name: memoNameInput.trim(),
			icon: StickyNote,
			iconKey: "StickyNote",
			color: "#FFEB3B",
			type: "memo",
			content: "",
		};

		// Add the new app to the apps array
		setApps((prev) => [...prev, memoApp]);

		// Set the position for the new memo in the clicked cell
		setAppPositions((prev) => {
			const newPositions = new Map(prev);
			if (memoNameDialog.position) {
				newPositions.set(memoId, memoNameDialog.position);
			}
			return newPositions;
		});

		setMemoCounter((prev) => prev + 1);
		setMemoNameDialog({ visible: false, position: null });
		setMemoNameInput("");
	};

	const createAppWithUrl = async () => {
		if (!appUrlDialog.position || !appUrlInput.trim()) return;

		setIsLoadingApp(true);

		try {
			let url = appUrlInput.trim();
			if (!url.startsWith("http://") && !url.startsWith("https://")) {
				url = `https://${url}`;
			}

			// Try to fetch site metadata
			let siteName = "";
			let favicon = "";

			try {
				favicon = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`;
				siteName = new URL(url).hostname.replace("www.", "");
				const isUrlExist = await checkUrlExists(url);
				if (!isUrlExist) {
					favicon = "";
				}
			} catch (error) {
				console.error("Error fetching site metadata:", error);
				// Fallback to domain name
				favicon = "";
				siteName = new URL(url).hostname.replace("www.", "");
			}

			// If no site name found, use domain
			if (!siteName) {
				siteName = new URL(url).hostname;
			}

			const appId = `app-${Date.now()}`;
			const newApp: AppIcon = {
				id: appId,
				name: siteName,
				icon: Globe,
				iconKey: "Globe",
				color: "#FFEB3B",
				type: "website",
				url: url,
				favicon: favicon,
			};

			// Add the new app to the apps array
			setApps((prev) => [...prev, newApp]);

			// Set the position for the new app in the clicked cell
			setAppPositions((prev) => {
				const newPositions = new Map(prev);
				if (appUrlDialog.position) {
					newPositions.set(appId, appUrlDialog.position);
				}
				return newPositions;
			});

			setAppUrlDialog({
				visible: false,
				position: null,
			});
			setAppUrlInput("");
		} catch (error) {
			console.error("Error creating app:", error);
			// Still create the app with basic info
			const appId = `app-${Date.now()}`;
			const newApp: AppIcon = {
				id: appId,
				name: appUrlInput.trim(),
				icon: Globe,
				iconKey: "Globe",
				color: "#FFEB3B",
				type: "website",
				url: appUrlInput.startsWith("http") ? appUrlInput : `https://${appUrlInput}`,
			};

			setApps((prev) => [...prev, newApp]);
			setAppPositions((prev) => {
				const newPositions = new Map(prev);
				if (appUrlDialog.position) {
					newPositions.set(appId, appUrlDialog.position);
				}
				return newPositions;
			});

			setAppUrlDialog({
				visible: false,
				position: null,
			});
			setAppUrlInput("");
		} finally {
			setIsLoadingApp(false);
		}
	};

	const createFolderWithName = () => {
		if (!folderNameDialog.position || !folderNameInput.trim()) return;

		const folderId = `folder-${Date.now()}`;
		const folderApp: AppIcon = {
			id: folderId,
			name: folderNameInput.trim(),
			icon: FolderIcon,
			iconKey: "FolderIcon",
			color: "#FFEB3B",
			type: "folder",
		};

		// Add the new folder to the apps array
		setApps((prev) => [...prev, folderApp]);

		// Set the position for the new folder in the clicked cell
		setAppPositions((prev) => {
			const newPositions = new Map(prev);
			if (folderNameDialog.position) {
				newPositions.set(folderId, folderNameDialog.position);
			}

			return newPositions;
		});

		// Initialize empty folder contents
		setFolderContents((prev) => {
			const newContents = new Map(prev);
			newContents.set(folderId, []);
			return newContents;
		});

		setFolderCounter((prev) => prev + 1);
		setFolderNameDialog({ visible: false, position: null });
		setFolderNameInput("");
	};

	const cancelMemoCreation = () => {
		setMemoNameDialog({ visible: false, position: null });
		setMemoNameInput("");
	};

	const cancelAppCreation = () => {
		setAppUrlDialog({ visible: false, position: null });
		setAppUrlInput("");
	};

	const cancelFolderCreation = () => {
		setFolderNameDialog({ visible: false, position: null });
		setFolderNameInput("");
	};

	const openMemo = (memoApp: AppIcon) => {
		const existingWindow = memoWindows.find((w) => w.id === memoApp.id);

		if (existingWindow) {
			// Bring to front
			setMemoWindows((prev) =>
				prev.map((w) =>
					w.id === memoApp.id
						? {
								...w,
								isMinimized: false,
								zIndex: nextzIndex,
							}
						: w,
				),
			);
			setNextzIndex((prev) => prev + 1);
		} else {
			// Create new window
			const newWindow: MemoWindowType = {
				id: memoApp.id,
				title: memoApp.name,
				content: memoApp.content || "",
				position: {
					x: 100 + memoWindows.length * 30,
					y: 100 + memoWindows.length * 30,
				},
				size: { width: 600, height: 400 },
				isMinimized: false,
				zIndex: nextzIndex,
			};

			setMemoWindows((prev) => [...prev, newWindow]);
			setNextzIndex((prev) => prev + 1);
		}
	};

	const openBrowser = (app: AppIcon) => {
		if (!app.url) return;

		const existingWindow = browserWindows.find((w) => w.id === app.id);

		if (existingWindow) {
			// Bring to front
			setBrowserWindows((prev) =>
				prev.map((w) =>
					w.id === app.id
						? {
								...w,
								isMinimized: false,
								zIndex: nextzIndex,
							}
						: w,
				),
			);
			setNextzIndex((prev) => prev + 1);
		} else {
			// Create new window
			const newWindow: BrowserWindowType = {
				id: app.id,
				title: app.name,
				url: app.url,
				position: {
					x: 150 + browserWindows.length * 30,
					y: 80 + browserWindows.length * 30,
				},
				size: { width: 1000, height: 700 },
				isMinimized: false,
				zIndex: nextzIndex,
			};

			setBrowserWindows((prev) => [...prev, newWindow]);
			setNextzIndex((prev) => prev + 1);
		}
	};

	const openFolder = (folderApp: AppIcon) => {
		const existingWindow = folderWindows.find((w) => w.id === folderApp.id);

		if (existingWindow) {
			// Bring to front
			setFolderWindows((prev) =>
				prev.map((w) =>
					w.id === folderApp.id
						? {
								...w,
								isMinimized: false,
								zIndex: nextzIndex,
							}
						: w,
				),
			);
			setNextzIndex((prev) => prev + 1);
		} else {
			// Create new window
			const newWindow: FolderWindowType = {
				id: folderApp.id,
				title: folderApp.name,
				position: {
					x: 200 + folderWindows.length * 30,
					y: 120 + folderWindows.length * 30,
				},
				size: { width: 800, height: 600 },
				isMinimized: false,
				zIndex: nextzIndex,
			};

			setFolderWindows((prev) => [...prev, newWindow]);
			setNextzIndex((prev) => prev + 1);
		}
	};

	// difference detection
	const appsChanged = JSON.stringify(apps) !== JSON.stringify(originalApps);
	const positionsChanged =
		JSON.stringify(Array.from(appPositions.entries())) !==
		JSON.stringify(Array.from(originalAppPositions.entries()));
	const showDesktopSaveBtn = positionsInitialized ? appsChanged || positionsChanged : false;

	const handleSaveDesktop = async () => {
		setOriginalApps(apps);
		setOriginalAppPositions(appPositions);
		const apiApps = apps.map((app) => ({
			id: app.id,
			name: app.name,
			iconKey: app.iconKey,
			color: "#FFEB3B",
			type: app.type,
			content: app.content,
			url: app.url,
			favicon: app.favicon,
		}));
		const state = {
			apps: apiApps,
			appPositions: Object.fromEntries(appPositions.entries()),
		};
		const prevOriginalApps = originalApps;
		const prevOriginalAppPositions = originalAppPositions;
		try {
			const res = await hono.api.desktop.state.$put({
				json: { state },
			});
			if (!res.ok) {
				toast("Desktop update failed", {
					style: { color: "#dc2626" },
				});
				setOriginalApps(prevOriginalApps);
				setOriginalAppPositions(prevOriginalAppPositions);
				return;
			}
			toast("Desktop state saved");
		} catch (e) {
			toast("Desktop update failed", {
				style: { color: "#dc2626" },
			});
			setOriginalApps(prevOriginalApps);
			setOriginalAppPositions(prevOriginalAppPositions);
		}
	};

	const updateMemoContent = (windowId: string, content: string) => {
		// Update memo window content
		setMemoWindows((prev) => prev.map((w) => (w.id === windowId ? { ...w, content } : w)));

		// Update app content without triggering position recalculation
		setApps((prev) => prev.map((app) => (app.id === windowId ? { ...app, content } : app)));
	};

	const closeMemoWindow = (windowId: string) => {
		setMemoWindows((prev) => prev.filter((w) => w.id !== windowId));
	};

	const closeBrowserWindow = (windowId: string) => {
		setBrowserWindows((prev) => prev.filter((w) => w.id !== windowId));
	};

	const closeFolderWindow = (windowId: string) => {
		setFolderWindows((prev) => prev.filter((w) => w.id !== windowId));
	};

	const minimizeMemoWindow = (windowId: string) => {
		setMemoWindows((prev) =>
			prev.map((w) => (w.id === windowId ? { ...w, isMinimized: true } : w)),
		);
	};

	const minimizeBrowserWindow = (windowId: string) => {
		setBrowserWindows((prev) =>
			prev.map((w) => (w.id === windowId ? { ...w, isMinimized: true } : w)),
		);
	};

	const minimizeFolderWindow = (windowId: string) => {
		setFolderWindows((prev) =>
			prev.map((w) => (w.id === windowId ? { ...w, isMinimized: true } : w)),
		);
	};

	const bringHelpWindowToFront = () => {
		setHelpWindow((prev) => ({
			...prev,
			zIndex: nextzIndex,
		}));
		setNextzIndex((prev) => prev + 1);
	};

	const bringMemoToFront = (windowId: string) => {
		setMemoWindows((prev) =>
			prev.map((w) => (w.id === windowId ? { ...w, zIndex: nextzIndex } : w)),
		);
		setNextzIndex((prev) => prev + 1);
	};

	const bringBrowserToFront = (windowId: string) => {
		setBrowserWindows((prev) =>
			prev.map((w) => (w.id === windowId ? { ...w, zIndex: nextzIndex } : w)),
		);
		setNextzIndex((prev) => prev + 1);
	};

	const bringFolderToFront = (windowId: string) => {
		setFolderWindows((prev) =>
			prev.map((w) => (w.id === windowId ? { ...w, zIndex: nextzIndex } : w)),
		);
		setNextzIndex((prev) => prev + 1);
	};

	const removeFromFolder = (folderId: string, appId: string) => {
		// Remove app from folder
		setFolderContents((prev) => {
			const newContents = new Map(prev);
			const currentContents = newContents.get(folderId) || [];
			newContents.set(
				folderId,
				currentContents.filter((id) => id !== appId),
			);
			return newContents;
		});

		// Find next empty position and place the app there
		const emptyPosition = findNextEmptyPosition();
		if (emptyPosition) {
			setAppPositions((prev) => {
				const newPositions = new Map(prev);
				newPositions.set(appId, emptyPosition);
				return newPositions;
			});
		}
	};

	const handleAppClick = (app: AppIcon) => {
		if (app.type === "memo") {
			openMemo(app);
		} else if (app.type === "website") {
			openBrowser(app);
		} else if (app.type === "folder") {
			openFolder(app);
		}
	};

	const handleBackgroundChange = (newBackground: string) => {
		setBackground(newBackground);
	};

	const getBackgroundStyle = () => {
		if (background.startsWith("http")) {
			return {
				backgroundImage: `url(${background})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
			};
		}
		return {
			background: background,
		};
	};
	const renderAppIcon = (app: AppIcon) => {
		if (app.type === "website" && app.favicon) {
			return (
				<div className="relative h-7 w-7 ">
					<Image
						src={app.favicon}
						alt={app.name}
						width={28}
						height={28}
						className="h-7 w-7 rounded-sm"
						onError={(e) => {
							// Fallback to Globe icon if favicon fails to load
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
						size={24}
						className="fallback-icon absolute inset-0 hidden text-white drop-shadow-sm"
					/>
				</div>
			);
		}
		return <app.icon size={28} className="text-white drop-shadow-sm" />;
	};

	const getFolderAppCount = (folderId: string): number => {
		return folderContents.get(folderId)?.length || 0;
	};

	const renderGrid = () => {
		const grid = [];

		for (let row = 0; row < GRID_ROWS; row++) {
			for (let col = 0; col < GRID_COLS; col++) {
				const app = getAppAtPosition(row, col);
				const isDropTarget = draggedOver?.row === row && draggedOver?.col === col;
				const isFolderDropTarget = app?.type === "folder" && draggedOverFolder === app.id;

				grid.push(
					<div
						key={`${row}-${col}`}
						className={`relative flex items-center justify-center border border-white/10 transition-all duration-200 ease-in-out ${
							isDropTarget ? "scale-105 rounded-2xl bg-white/10" : ""
						}
              ${
								isFolderDropTarget
									? "scale-105 rounded-2xl bg-blue-500/20 ring-2 ring-blue-400"
									: ""
							}
            `}
						onDragOver={(e) => handleDragOver(e, row, col)}
						onDragLeave={handleDragLeave}
						onDrop={(e) => handleDrop(e, row, col)}
						onContextMenu={(e) => handleRightClick(e, row, col)}
					>
						{app && (
							<div
								draggable={isEdit}
								onDragStart={(e) => handleDragStart(e, app.id)}
								onDragEnd={handleDragEnd}
								onClick={() => handleAppClick(app)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										handleAppClick(app);
									}
								}}
								className="group hover:-translate-y-1 flex transform cursor-grab flex-col items-center transition-all duration-200 ease-out hover:scale-110 active:cursor-grabbing"
							>
								<div
									className={`relative h-14 w-14 rounded-2xl ${app.color}shadow-lg flex items-center justify-center border border-white/20 backdrop-blur-sm transition-all duration-200 hover:shadow-xl group-hover:border-white/30 group-hover:shadow-2xl `}
								>
									{renderAppIcon(app)}
									{app.type === "website" && app.favicon && (
										<Globe size={28} className="hidden text-white drop-shadow-sm" />
									)}
									{app.type === "folder" && getFolderAppCount(app.id) > 0 && (
										<div className="-top-1 -right-1 absolute flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 font-bold text-white text-xs">
											{getFolderAppCount(app.id)}
										</div>
									)}
									<div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-white/10" />
								</div>
								<div className="mt-1 text-center font-medium text-white text-xs drop-shadow-sm">
									{app.name}
								</div>
							</div>
						)}
					</div>,
				);
			}
		}

		return grid;
	};

	return (
		<div className="relative min-h-screen overflow-hidden" style={getBackgroundStyle()}>
			{/* Background overlay for better contrast */}
			<div className="absolute inset-0 bg-black/20" />

			{/* Menu bar */}
			<MenuBar
				onBackgroundChange={handleBackgroundChange}
				background={background}
				setBackground={setBackground}
				currentTime={currentTime}
				isPublic={isPublic}
				setIsPublic={setIsPublic}
				osName={osName}
				isEditable={isEdit}
				helpWindow={helpWindow}
				setHelpWindow={setHelpWindow}
			/>

			{/* Desktop grid */}
			<div className="relative z-10 h-[calc(100vh-2rem)] p-8">
				<div
					className="mx-auto grid h-full max-w-6xl gap-0"
					style={{
						gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
						gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
					}}
				>
					{renderGrid()}
				</div>
			</div>

			{/* Context Menu */}
			{contextMenu.visible && (
				<ContextMenu
					contextMenu={contextMenu}
					showEditDialog={showEditDialog}
					deleteApp={deleteApp}
					showAppUrlDialog={showAppUrlDialog}
					showMemoNameDialog={showMemoNameDialog}
					showFolderNameDialog={showFolderNameDialog}
				/>
			)}

			{/* Edit Dialog */}
			{editDialog.visible && editDialog.app && (
				<CommonDialog
					visible={editDialog.visible}
					title={`Edit ${editDialog.app.type === "memo" ? "Memo" : editDialog.app.type === "folder" ? "Folder" : "App"}`}
					onCancel={cancelEdit}
					onSave={saveEdit}
					saveDisabled={!editDialog.newName.trim()}
					dialogZIndex={nextzIndex}
					dialogClassName="edit-dialog"
				>
					<div>
						<label htmlFor="edit-name" className="mb-2 block font-medium text-gray-700 text-sm">
							Name
						</label>
						<input
							id="edit-name"
							type="text"
							value={editDialog.newName}
							onChange={(e) =>
								setEditDialog((prev) => ({
									...prev,
									newName: e.target.value,
								}))
							}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									saveEdit();
								} else if (e.key === "Escape") {
									cancelEdit();
								}
							}}
							className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
							placeholder="Enter name..."
							// autoFocus
						/>
					</div>
					{editDialog.app.type === "website" && (
						<div>
							<label htmlFor="edit-url" className="mb-2 block font-medium text-gray-700 text-sm">
								URL
							</label>
							<input
								id="edit-url"
								type="url"
								value={editDialog.newUrl}
								onChange={(e) =>
									setEditDialog((prev) => ({
										...prev,
										newUrl: e.target.value,
									}))
								}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										saveEdit();
									} else if (e.key === "Escape") {
										cancelEdit();
									}
								}}
								className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
								placeholder="https://example.com"
							/>
						</div>
					)}
				</CommonDialog>
			)}

			{/* App URL Dialog */}
			{appUrlDialog.visible && (
				<CommonDialog
					visible={appUrlDialog.visible}
					title="Create New App"
					onCancel={cancelAppCreation}
					onSave={createAppWithUrl}
					saveDisabled={!appUrlInput.trim() || isLoadingApp}
					saveLabel={isLoadingApp ? "Creating..." : "Save"}
					dialogZIndex={nextzIndex}
					dialogClassName="app-dialog"
				>
					<div className="mb-4">
						<label htmlFor="app-url" className="mb-2 block font-medium text-gray-700 text-sm">
							Website URL
						</label>
						<input
							id="app-url"
							type="url"
							value={appUrlInput}
							onChange={(e) => setAppUrlInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									createAppWithUrl();
								} else if (e.key === "Escape") {
									cancelAppCreation();
								}
							}}
							className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
							placeholder="https://example.com"
							// autoFocus
						/>
					</div>
				</CommonDialog>
			)}

			{/* Memo Name Dialog */}
			{memoNameDialog.visible && (
				<CommonDialog
					visible={memoNameDialog.visible}
					title="Create New Memo"
					onCancel={cancelMemoCreation}
					onSave={createMemoWithName}
					saveDisabled={!memoNameInput.trim()}
					dialogZIndex={nextzIndex}
					dialogClassName="memo-dialog"
				>
					<div className="mb-4">
						<label htmlFor="memo-name" className="mb-2 block font-medium text-gray-700 text-sm">
							Memo Name
						</label>
						<input
							id="memo-name"
							type="text"
							value={memoNameInput}
							onChange={(e) => setMemoNameInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									createMemoWithName();
								} else if (e.key === "Escape") {
									cancelMemoCreation();
								}
							}}
							className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
							placeholder="Enter memo name..."
							// autoFocus
						/>
					</div>
				</CommonDialog>
			)}

			{/* Folder Name Dialog */}
			{folderNameDialog.visible && (
				<CommonDialog
					visible={folderNameDialog.visible}
					title="Create New Folder"
					onCancel={cancelFolderCreation}
					onSave={createFolderWithName}
					saveDisabled={!folderNameInput.trim()}
					dialogZIndex={nextzIndex}
					dialogClassName="folder-dialog"
				>
					<div className="mb-4">
						<label htmlFor="folder-name" className="mb-2 block font-medium text-gray-700 text-sm">
							Folder Name
						</label>
						<input
							id="folder-name"
							type="text"
							value={folderNameInput}
							onChange={(e) => setFolderNameInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									createFolderWithName();
								} else if (e.key === "Escape") {
									cancelFolderCreation();
								}
							}}
							className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
							placeholder="Enter folder name..."
							// autoFocus
						/>
					</div>
				</CommonDialog>
			)}

			{/* Help Window */}
			{helpWindow.visible && (
				<HelpWindow
					window={helpWindow}
					onClose={() =>
						setHelpWindow((prev) => ({
							...prev,
							visible: false,
						}))
					}
					// onMinimize={}
					onBringToFront={() => {
						bringHelpWindowToFront();
					}}
					onPositionChange={(position) => {
						setHelpWindow((prev) => ({
							...prev,
							position,
						}));
					}}
					onSizeChange={(size) => {
						setHelpWindow((prev) => ({
							...prev,
							size,
						}));
					}}
				/>
			)}

			{/* Memo Windows */}
			{memoWindows.map(
				(window) =>
					!window.isMinimized && (
						<MemoWindow
							key={window.id}
							window={window}
							isEditable={isEdit}
							onClose={() => closeMemoWindow(window.id)}
							onMinimize={() => minimizeMemoWindow(window.id)}
							onContentChange={(content) => updateMemoContent(window.id, content)}
							onBringToFront={() => bringMemoToFront(window.id)}
							onPositionChange={(position) => {
								setMemoWindows((prev) =>
									prev.map((w) =>
										w.id === window.id
											? {
													...w,
													position,
												}
											: w,
									),
								);
							}}
							onSizeChange={(size) => {
								setMemoWindows((prev) =>
									prev.map((w) =>
										w.id === window.id
											? {
													...w,
													size,
												}
											: w,
									),
								);
							}}
						/>
					),
			)}

			{/* Browser Windows */}
			{browserWindows.map(
				(window) =>
					!window.isMinimized && (
						<BrowserWindow
							key={window.id}
							window={window}
							onClose={() => closeBrowserWindow(window.id)}
							onMinimize={() => minimizeBrowserWindow(window.id)}
							onBringToFront={() => bringBrowserToFront(window.id)}
							onPositionChange={(position) => {
								setBrowserWindows((prev) =>
									prev.map((w) =>
										w.id === window.id
											? {
													...w,
													position,
												}
											: w,
									),
								);
							}}
							onSizeChange={(size) => {
								setBrowserWindows((prev) =>
									prev.map((w) =>
										w.id === window.id
											? {
													...w,
													size,
												}
											: w,
									),
								);
							}}
						/>
					),
			)}

			{/* Folder Windows */}
			{folderWindows.map(
				(window) =>
					!window.isMinimized && (
						<FolderWindow
							key={window.id}
							window={window}
							folderContents={folderContents.get(window.id) || []}
							apps={apps}
							onClose={() => closeFolderWindow(window.id)}
							onMinimize={() => minimizeFolderWindow(window.id)}
							onBringToFront={() => bringFolderToFront(window.id)}
							onRemoveApp={(appId) => removeFromFolder(window.id, appId)}
							onAppClick={handleAppClick}
							onPositionChange={(position) => {
								setFolderWindows((prev) =>
									prev.map((w) =>
										w.id === window.id
											? {
													...w,
													position,
												}
											: w,
									),
								);
							}}
							onSizeChange={(size) => {
								setFolderWindows((prev) =>
									prev.map((w) =>
										w.id === window.id
											? {
													...w,
													size,
												}
											: w,
									),
								);
							}}
						/>
					),
			)}

			{/* Dock */}
			<div className="-translate-x-1/2 fixed bottom-4 left-1/2 z-20 transform">
				<div className="flex items-center space-x-2 rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-md">
					{/* Minimized memo windows in dock */}
					{memoWindows
						.filter((w) => w.isMinimized)
						.map((window) => (
							<div
								key={`dock-memo-${window.id}`}
								className="group hover:-translate-y-2 transform cursor-pointer transition-all duration-200 hover:scale-125"
								onClick={() => {
									setMemoWindows((prev) =>
										prev.map((w) =>
											w.id === window.id
												? {
														...w,
														isMinimized: false,
														zIndex: nextzIndex,
													}
												: w,
										),
									);
									setNextzIndex((prev) => prev + 1);
								}}
								onKeyDown={(e) => {
									e.preventDefault();
									setMemoWindows((prev) =>
										prev.map((w) =>
											w.id === window.id
												? {
														...w,
														isMinimized: false,
														zIndex: nextzIndex,
													}
												: w,
										),
									);
									setNextzIndex((prev) => prev + 1);
								}}
							>
								<div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-yellow-300 shadow-lg transition-all duration-200 group-hover:shadow-xl">
									<StickyNote size={24} className="text-white" />
									<div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-white/10" />
								</div>
							</div>
						))}

					{/* Minimized browser windows in dock */}
					{browserWindows
						.filter((w) => w.isMinimized)
						.map((window) => (
							<div
								key={`dock-browser-${window.id}`}
								className="group hover:-translate-y-2 transform cursor-pointer transition-all duration-200 hover:scale-125"
								onClick={() => {
									setBrowserWindows((prev) =>
										prev.map((w) =>
											w.id === window.id
												? {
														...w,
														isMinimized: false,
														zIndex: nextzIndex,
													}
												: w,
										),
									);
									setNextzIndex((prev) => prev + 1);
								}}
								onKeyDown={(e) => {
									e.preventDefault();
									setBrowserWindows((prev) =>
										prev.map((w) =>
											w.id === window.id
												? {
														...w,
														isMinimized: false,
														zIndex: nextzIndex,
													}
												: w,
										),
									);
									setNextzIndex((prev) => prev + 1);
								}}
							>
								<div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-blue-500 shadow-lg transition-all duration-200 group-hover:shadow-xl">
									<Globe size={24} className="text-white" />
									<div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-white/10" />
								</div>
							</div>
						))}

					{/* Minimized folder windows in dock */}
					{folderWindows
						.filter((w) => w.isMinimized)
						.map((window) => (
							<div
								key={`dock-folder-${window.id}`}
								className="group hover:-translate-y-2 transform cursor-pointer transition-all duration-200 hover:scale-125"
								onClick={() => {
									setFolderWindows((prev) =>
										prev.map((w) =>
											w.id === window.id
												? {
														...w,
														isMinimized: false,
														zIndex: nextzIndex,
													}
												: w,
										),
									);
									setNextzIndex((prev) => prev + 1);
								}}
								onKeyDown={(e) => {
									e.preventDefault();
									setFolderWindows((prev) =>
										prev.map((w) =>
											w.id === window.id
												? {
														...w,
														isMinimized: false,
														zIndex: nextzIndex,
													}
												: w,
										),
									);
									setNextzIndex((prev) => prev + 1);
								}}
							>
								<div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-blue-600 shadow-lg transition-all duration-200 group-hover:shadow-xl">
									<FolderIcon size={24} className="text-white" />
									<div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-white/10" />
								</div>
							</div>
						))}
				</div>
			</div>
			{showDesktopSaveBtn && isEdit && (
				<div className="fixed right-6 bottom-6 z-50 rounded-md bg-white p-4 text-black text-sm shadow-lg transition">
					<p>Do you want to save changes?</p>
					<Button size="sm" className="mt-2" onClick={handleSaveDesktop}>
						Save
					</Button>
				</div>
			)}
		</div>
	);
}
