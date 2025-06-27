import type React from "react";

type Props = {
	visible: boolean;
	title: string;
	children: React.ReactNode;
	onCancel: () => void;
	onSave?: () => void;
	saveDisabled?: boolean;
	cancelLabel?: string;
	saveLabel?: string;
	dialogZIndex: number;
};

export const CommonDialog = ({
	visible,
	title,
	children,
	onCancel,
	onSave,
	saveDisabled,
	cancelLabel = "Cancel",
	saveLabel = "Save",
	dialogZIndex,
}: Props) => {
	if (!visible) return null;
	return (
		<div
			className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
			style={{ zIndex: dialogZIndex }}
		>
			<div className="min-w-[400px] rounded-xl border border-gray-200 bg-white p-6 shadow-2xl">
				<h3 className="mb-4 font-semibold text-gray-800 text-lg">{title}</h3>
				<div className="mb-4">{children}</div>
				<div className="mt-6 flex justify-end space-x-3">
					<button
						onClick={onCancel}
						className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 text-sm transition-colors hover:bg-gray-200"
						type="button"
					>
						{cancelLabel}
					</button>
					{onSave && (
						<button
							onClick={onSave}
							disabled={saveDisabled}
							className="rounded-lg bg-blue-500 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
							type="button"
						>
							{saveLabel}
						</button>
					)}
				</div>
			</div>
		</div>
	);
};
