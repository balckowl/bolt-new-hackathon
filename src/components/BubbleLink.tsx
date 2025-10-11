import { Button } from "@/components/ui/button";
import type { Editor } from "@tiptap/react";
import { Link2 } from "lucide-react";
import { type ChangeEvent, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Props = {
	editor: Editor;
};

export const BubbleLink = ({ editor }: Props) => {
	const [visibleUrlInput, setVisibleUrlInput] = useState(false);
	const [url, setUrl] = useState("");

	const applyUrl = () => {
		editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();

		setVisibleUrlInput(false);
		setUrl("");
	};

	const handleChangeUrl = (e: ChangeEvent<HTMLInputElement>) => {
		setUrl(e.target.value);
	};

	const openLinkInput = () => {
		const previousUrl = editor.getAttributes("link").href;

		setVisibleUrlInput(true);
		setUrl(previousUrl);
	};

	const handleUnlink = () => {
		editor.chain().focus().extendMarkRange("link").unsetLink().run();
	};

	const isSelectedLink = editor.isActive("link");
	if (isSelectedLink && !visibleUrlInput) {
		const previousUrl = editor.getAttributes("link").href;

		return (
			<div className="rounded-lg border border-gray-300 bg-white p-1">
				<a
					href={previousUrl}
					target="_blank"
					rel="noreferrer noopener"
					className="block w-32 truncate text-blue-600 hover:text-blue-800"
					title={previousUrl}
				>
					{previousUrl}
				</a>
				<div>
					<Button
						size="sm"
						variant="outline"
						className="mr-1 h-6 w-[70px] rounded-md"
						type="button"
						onClick={openLinkInput}
					>
						Cancel
					</Button>
					<Button
						size="sm"
						className="h-6 w-[70px] rounded-md"
						type="button"
						onClick={handleUnlink}
					>
						Edit
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div>
			{visibleUrlInput ? (
				<div className="w-full max-w-xs">
					<form className="flex" onSubmit={applyUrl}>
						<Input
							id="input"
							placeholder="https://"
							className="h-6 rounded-r-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
							onChange={handleChangeUrl}
							value={url}
						/>
						<Button className="h-6 rounded-l-none" type="submit">
							Submit
						</Button>
					</form>
				</div>
			) : (
				<button
					type="button"
					className="cursor-pointer rounded-lg border border-gray-300 bg-white transition-colors hover:bg-gray-50"
					onClick={() => {
						setVisibleUrlInput(true);
					}}
				>
					<Link2 className="-rotate-45" width="20" height="20" />
				</button>
			)}
		</div>
	);
};
