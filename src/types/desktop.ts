import type { desktopStateSchema } from "@/src/server/models/os.schema";
import type { LucideIcon } from "lucide-react";
import type z from "zod";

export interface AppIcon {
	id: string;
	name: string;
	icon: LucideIcon;
	iconKey: "StickyNote" | "Globe" | "FolderIcon";
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

export type CurrentUserType = Pick<
	z.infer<typeof desktopStateSchema>,
	"currentUserIcon" | "currentUserOsName" | "currentUsername"
> | null;

export interface HelpWindowType {
	visible: boolean;
	content: string;
	position: { x: number; y: number };
	size: { width: number; height: number };
	isMinimized: boolean;
	zIndex: number;
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
