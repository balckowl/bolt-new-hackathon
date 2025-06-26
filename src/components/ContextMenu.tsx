import type { ContextMenuType } from "@/src/types/desktop";
import { Edit3, FolderIcon, Plus, StickyNote, Trash2 } from "lucide-react";

type Props = {
	contextMenu: ContextMenuType;
	showEditDialog: (e: React.MouseEvent) => void;
	deleteApp: (e: React.MouseEvent) => void;
	showAppUrlDialog: (e: React.MouseEvent) => void;
	showMemoNameDialog: (e: React.MouseEvent) => void;
	showFolderNameDialog: (e: React.MouseEvent) => void;
};

export const ContextMenu = ({
	contextMenu,
	showEditDialog,
	deleteApp,
	showAppUrlDialog,
	showMemoNameDialog,
	showFolderNameDialog,
}: Props) => {
	return (
		<div
			className="context-menu fixed z-50 min-w-[150px] rounded-lg border border-white/20 bg-white/90 py-2 shadow-xl backdrop-blur-md"
			style={{
				left: contextMenu.x,
				top: contextMenu.y,
			}}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					e.stopPropagation();
				}
			}}
			onClick={(e) => e.stopPropagation()}
		>
			{contextMenu.existingApp ? (
				// Menu for existing apps
				<>
					<button
						onClick={showEditDialog}
						className="flex w-full items-center space-x-2 px-4 py-2 text-left text-gray-800 text-sm transition-colors hover:bg-blue-500/20"
						type="button"
					>
						<Edit3 size={16} />
						<span>Edit</span>
					</button>
					<button
						onClick={deleteApp}
						className="flex w-full items-center space-x-2 px-4 py-2 text-left text-red-600 text-sm transition-colors hover:bg-red-500/20"
						type="button"
					>
						<Trash2 size={16} />
						<span>Delete</span>
					</button>
				</>
			) : (
				// Menu for empty cells
				<>
					<button
						onClick={showAppUrlDialog}
						className="flex w-full items-center space-x-2 px-4 py-2 text-left text-gray-800 text-sm transition-colors hover:bg-blue-500/20"
						type="button"
					>
						<Plus size={16} />
						<span>Create App</span>
					</button>
					<button
						onClick={showMemoNameDialog}
						className="flex w-full items-center space-x-2 px-4 py-2 text-left text-gray-800 text-sm transition-colors hover:bg-blue-500/20"
						type="button"
					>
						<StickyNote size={16} />
						<span>Create Memo</span>
					</button>
					<button
						onClick={showFolderNameDialog}
						className="flex w-full items-center space-x-2 px-4 py-2 text-left text-gray-800 text-sm transition-colors hover:bg-blue-500/20"
						type="button"
					>
						<FolderIcon size={16} />
						<span>Create Folder</span>
					</button>
				</>
			)}
		</div>
	);
};
