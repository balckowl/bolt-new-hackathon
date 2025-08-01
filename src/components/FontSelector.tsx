import { ChevronDown, CircleCheck } from "lucide-react";
import { toast } from "sonner";
import { hono } from "../lib/hono-client";
import type { FontOptionType } from "../types/desktop";
import { Button } from "./ui/button";
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
	const handleFontChange = async (newFont: FontOptionType) => {
		onFontChange(newFont);
		try {
			await hono.api.desktop.font.$put({
				json: {
					font: newFont,
				},
			});

			toast("font changed");
		} catch (e) {
			toast("Font change failed", {
				style: { color: "#dc2626" },
			});
			console.error("Failed to update visibility:", e);
		}
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="sm" className="h-6 px-2 text-white text-xs hover:bg-white/10">
					Font
					<ChevronDown className="ml-1 h-3 w-3" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className={`w-[300px] border border-white/20 bg-white/95 px-0 py-4 shadow-xl backdrop-blur-md ${getFontStyle(currentFont)}`}
				align="start"
				side="bottom"
			>
				<h3 className="mb-3 px-4 font-medium text-gray-900 text-sm">Choose Font</h3>
				<ul>
					{fontOptions.map((font) => (
						<li key={font}>
							<Button
								type="button"
								variant="ghost"
								className={`flex w-full justify-between px-4 ${getFontStyle(font)}`}
								onClick={() => handleFontChange(font)}
							>
								{font}
								{currentFont === font && (
									<div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
										<svg className="h-4 w-4 text-white\" fill="currentColor\" viewBox="0 0 20 20">
											<title>Check</title>
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\"
												clipRule="evenodd"
											/>
										</svg>
									</div>
								)}
							</Button>
						</li>
					))}
				</ul>
			</PopoverContent>
		</Popover>
	);
}
