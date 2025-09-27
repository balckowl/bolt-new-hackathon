import { BadgeInfo, Info } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type Props = {
	getHelpWindow: () => void;
};

export default function AboutSelector({ getHelpWindow }: Props) {
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button type="button" className="h-6 rounded-sm px-3 text-white hover:bg-white/20">
					<Info size={18} />
				</button>
			</PopoverTrigger>
			<PopoverContent
				className="w-[200px] border-white/10 border-b bg-white/40 px-1 py-1 shadow-xl backdrop-blur-md"
				align="start"
				side="bottom"
				sideOffset={12}
			>
				<ul>
					<li>
						<button
							type="button"
							// biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
							className={`flex w-full items-center justify-between rounded-sm px-4 hover:bg-black hover:text-white`}
						>
							ospace
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
							className={`flex w-full items-center justify-between rounded-sm px-4 hover:bg-black hover:text-white`}
						>
							instructions
						</button>
					</li>
				</ul>
			</PopoverContent>
		</Popover>
	);
}
