import type { ContextMenuType } from "@/src/types/desktop";
import { Edit3, FolderIcon, FolderOutput, Link2, Smile, StickyNote, Trash2, X } from "lucide-react";

type Props = {
	contextMenu: ContextMenuType;
	showEditDialog: (e: React.MouseEvent) => void;
	deleteApp: (e: React.MouseEvent) => void;
	showAppUrlDialog: (e: React.MouseEvent) => void;
	showMemoNameDialog: (e: React.MouseEvent) => void;
	showFolderNameDialog: (e: React.MouseEvent) => void;
	showSelectStampDialog: (e: React.MouseEvent) => void;
	removeFromFolder: (e: React.MouseEvent) => void;
};

export const ContextMenu = ({
	contextMenu,
	showEditDialog,
	deleteApp,
	showAppUrlDialog,
	showMemoNameDialog,
	showFolderNameDialog,
	showSelectStampDialog,
	removeFromFolder,
}: Props) => {
	return (
		<div
			className="context-menu fixed z-50 min-w-[150px] rounded-xl bg-white p-1 shadow-xl"
			style={{
				left: contextMenu.x,
				top: contextMenu.y,
				zIndex: 9999,
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
						className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-gray-800 text-sm transition-colors hover:bg-gray-800/10"
						type="button"
					>
						<p>Edit</p>
						<div className="flex h-5 w-5 items-center justify-center rounded-lg bg-black text-white">
							<Edit3 size={14} />
						</div>
					</button>
					{contextMenu.folderId && (
						<button
							onClick={removeFromFolder}
							className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-gray-800 text-sm transition-colors hover:bg-gray-800/10"
							type="button"
						>
							<p>Move out</p>
							<div className="flex h-5 w-5 items-center justify-center rounded-lg bg-black text-white">
								<FolderOutput size={14} />
							</div>
						</button>
					)}
					<button
						onClick={deleteApp}
						className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-red-600 text-sm transition-colors hover:bg-red-600/20"
						type="button"
					>
						<p>Delete</p>
						<div className="flex h-5 w-5 items-center justify-center rounded-lg bg-red-600 text-white">
							<Trash2 size={14} />
						</div>
					</button>
				</>
			) : (
				// Menu for empty cells
				<>
					<button
						onClick={showAppUrlDialog}
						className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-gray-800 text-sm transition-colors hover:bg-gray-800/10"
						type="button"
					>
						<p>Links</p>
						<div className="flex h-5 w-5 items-center justify-center rounded-sm bg-black text-white">
							<Link2 size={14} />
						</div>
					</button>
					<button
						onClick={showMemoNameDialog}
						className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-gray-800 text-sm transition-colors hover:bg-gray-800/10"
						type="button"
					>
						<p>Notes</p>
						<div className="flex h-5 w-5 items-center justify-center rounded-sm bg-black text-white">
							<StickyNote size={14} />
						</div>
					</button>
					<button
						onClick={showFolderNameDialog}
						className="group flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-gray-800 text-sm transition-colors hover:bg-gray-800/10"
						type="button"
					>
						<p>Folder</p>
						<div className="flex h-5 w-5 items-center justify-center rounded-sm bg-black text-white">
							<FolderIcon size={14} />
						</div>
					</button>
					<button
						onClick={showSelectStampDialog}
						className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-orange-600 text-sm transition-colors hover:bg-orange-600/10"
						type="button"
					>
						<p>Stamp</p>
						<div className="flex h-5 w-5 items-center justify-center rounded-sm bg-orange-600 text-white">
							<Smile size={14} />
						</div>
					</button>
				</>
			)}
		</div>
	);
};
