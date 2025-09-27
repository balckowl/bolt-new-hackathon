import { Check, LineSquiggle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { hono } from "../lib/hono-client";
import type { FontOptionType } from "../types/desktop";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type Props = {
	onFontChange: (newFont: FontOptionType) => void;
	currentFont: FontOptionType;
	getFontStyle: (newFont: FontOptionType) => void;
};

export const fontOptions: FontOptionType[] = [
	"INTER",
	"ALEGREYA",
	"ALLAN",
	"COMFORTAA",
	"LOBSTER",
	"LORA",
];

export default function FontSelector({ onFontChange, currentFont, getFontStyle }: Props) {
	const [open, setOpen] = useState(false);
	const handleFontChange = async (newFont: FontOptionType) => {
		toast.dismiss();
		onFontChange(newFont);
		try {
			await hono.api.desktop.font.$put({
				json: {
					font: newFont,
				},
			});
			toast("font changed");
			setOpen(false);
		} catch (e) {
			toast("Font change failed", {
				style: { color: "#dc2626" },
			});
			console.error("Failed to update visibility:", e);
		}
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					className="flex h-6 items-center rounded-sm px-3 text-sm text-white hover:bg-white/20"
				>
					<LineSquiggle size={17} />
				</button>
			</PopoverTrigger>
			<PopoverContent
				className={`w-[200px] border-0 bg-white/70 px-1 py-1 shadow-xl backdrop-blur-md ${getFontStyle(currentFont)}`}
				align="start"
				side="bottom"
				sideOffset={12}
			>
				<ul>
					{fontOptions.map((font) => (
						<li key={font}>
							<button
								type="button"
								className={`flex w-full items-center justify-between rounded-sm px-3 py-[2px] text-sm hover:bg-black hover:text-white ${getFontStyle(font)}`}
								onClick={() => handleFontChange(font)}
							>
								{font}
								{currentFont === font && <Check width={15} height={15} />}
							</button>
						</li>
					))}
				</ul>
			</PopoverContent>
		</Popover>
	);
}
