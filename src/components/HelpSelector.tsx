import { AppWindow, Info, SquareArrowOutUpRight } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type Props = {
	getHelpWindow: () => void;
};

export default function HelpSelector({ getHelpWindow }: Props) {
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					className="flex h-9 w-9 items-center justify-center rounded-full text-sm text-white hover:bg-white/20"
				>
					<Info size={18} />
				</button>
			</PopoverTrigger>
			<PopoverContent
				className="w-[185px] rounded-xl border-0 bg-white/90 px-1 py-1 shadow-xl"
				align="center"
				sideOffset={15}
			>
				<ul>
					<li>
						<button
							type="button"
							// biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
							className={`flex w-full items-center justify-between rounded-lg px-[10px] py-[6px] text-sm hover:bg-gray-800/10`}
						>
							Changelog
							<SquareArrowOutUpRight size={14} />
						</button>
					</li>

					<li>
						<button
							type="button"
							onClick={() => {
								getHelpWindow();
								setOpen(false);
							}}
							// biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
							className={`flex w-full items-center justify-between rounded-lg px-[10px] py-[6px] text-sm hover:bg-gray-800/10`}
						>
							Instructions
							<AppWindow size={14} />
						</button>
					</li>
				</ul>
			</PopoverContent>
		</Popover>
	);
}
