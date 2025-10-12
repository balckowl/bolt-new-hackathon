import type { ContextMenuType } from "@/src/types/desktop";
import {
	Edit3,
	FolderIcon,
	FolderOutput,
	Link2,
	PenTool,
	Smile,
	StickyNote,
	Trash2,
	X,
} from "lucide-react";

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
						<PenTool size={17} />
						<p>Edit</p>
					</button>
					{/* {contextMenu.folderId && (
            <button
              onClick={removeFromFolder}
              className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-gray-800 text-md transition-colors hover:bg-gray-800/10"
              type="button"
            >
              <FolderOutput size={15} />
              <p>Move out</p>
              <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-black text-white">
                <FolderOutput size={15} />
              </div>
            </button>
          )} */}
					<button
						onClick={deleteApp}
						className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-red-600 text-sm transition-colors hover:bg-red-600/10"
						type="button"
					>
						<Trash2 size={17} />
						<p>Delete</p>
					</button>
				</>
			) : (
				// Menu for empty cells
				<>
					<button
						onClick={showMemoNameDialog}
						className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-gray-800 text-sm transition-colors hover:bg-gray-800/10"
						type="button"
					>
						<StickyNote size={17} />
						<p>Notes</p>
					</button>
					<button
						onClick={showFolderNameDialog}
						className="group flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-gray-800 text-sm transition-colors hover:bg-gray-800/10"
						type="button"
					>
						<FolderIcon size={17} />
						<p>Folder</p>
					</button>
					<button
						onClick={showAppUrlDialog}
						className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-gray-800 text-sm transition-colors hover:bg-gray-800/10"
						type="button"
					>
						<Link2 size={17} />
						<p>Link</p>
					</button>
					{!contextMenu.folderId && (
						<button
							onClick={showSelectStampDialog}
							className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-orange-600 text-sm transition-colors hover:bg-orange-600/10"
							type="button"
						>
							<Smile size={17} />
							<p>Stamp</p>
						</button>
					)}
				</>
			)}
		</div>
	);
};
