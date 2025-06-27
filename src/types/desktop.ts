import type { LucideIcon } from "lucide-react";

export interface AppIcon {
	id: string;
	name: string;
	icon: LucideIcon;
	color: string;
	type?: "app" | "memo" | "website" | "folder";
	content?: string;
	url?: string;
	favicon?: string;
}

export interface GridPosition {
	row: number;
	col: number;
}

export interface MemoWindowType {
	id: string;
	title: string;
	content: string;
	position: { x: number; y: number };
	size: { width: number; height: number };
	isMinimized: boolean;
	zIndex: number;
}

export interface BrowserWindowType {
	id: string;
	title: string;
	url: string;
	position: { x: number; y: number };
	size: { width: number; height: number };
	isMinimized: boolean;
	zIndex: number;
}

export interface FolderWindowType {
	id: string;
	title: string;
	position: { x: number; y: number };
	size: { width: number; height: number };
	isMinimized: boolean;
	zIndex: number;
}

export interface ContextMenuType {
	visible: boolean;
	x: number;
	y: number;
	position: GridPosition | null;
	existingApp?: AppIcon | null;
}

export interface MemoNameDialog {
	visible: boolean;
	position: GridPosition | null;
}

export interface AppUrlDialog {
	visible: boolean;
	position: GridPosition | null;
}

export interface FolderNameDialog {
	visible: boolean;
	position: GridPosition | null;
}

export interface EditDialog {
	visible: boolean;
	app: AppIcon | null;
	newName: string;
	newUrl?: string;
}
