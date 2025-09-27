import { Button } from "@/src/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { hono } from "@/src/lib/hono-client";
import { ChevronDown, Lock, LockOpen } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { FontOptionType } from "../types/desktop";
import SwitchButton from "./SwitchButton";

type Props = {
	isPublic: boolean;
	setIsPublic: (isPublic: boolean) => void;
	getFontStyle: (newFont: FontOptionType) => void;
	currentFont: FontOptionType;
};

export const PublicSelector = ({ isPublic, setIsPublic, getFontStyle, currentFont }: Props) => {
	const [open, setOpen] = useState(false);

	const handleChange = async (select: boolean) => {
		if (select === isPublic) return;
		try {
			const res = await hono.api.desktop.visibility.$put({
				json: {
					isPublic: select,
				},
			});
			if (!res.ok) {
				toast("Failed to change public information", {
					style: { color: "#dc2626" },
				});
			}
			toast("Public information has been changed");
			setIsPublic(select);
			setOpen(false);
		} catch (e) {
			toast("Failed to change public information", {
				style: { color: "#dc2626" },
			});
			console.error("Failed to update visibility:", e);
		}
	};

	return (
		<Popover
			open={open}
			onOpenChange={(next) => {
				setOpen(next);
				if (next) {
					toast.dismiss();
				}
			}}
		>
			<PopoverTrigger asChild>
				<button type="button" className="h-6 px-2 text-sm text-white hover:bg-white/10">
					{isPublic ? <LockOpen width={17} height={17} /> : <Lock width={17} height={17} />}
				</button>
			</PopoverTrigger>
			<PopoverContent
				className={`w-[200px] border-white/10 border-b bg-white/40 px-4 py-2 shadow-xl backdrop-blur-md ${getFontStyle(currentFont)}`}
				align="start"
				side="bottom"
				sideOffset={12}
			>
				<div className="text-sm">
					<div className="grid grid-cols-3 gap-3">
						<RadioGroup
							value={isPublic ? "Public" : "Private"}
							onValueChange={(value) => handleChange(value === "Public")}
						>
							<div>
								<label htmlFor="public" className="flex cursor-pointer items-center gap-2">
									<RadioGroupItem value="Public" id="public" />
									<span>Public</span>
								</label>
							</div>
							<div>
								<label htmlFor="private" className="flex cursor-pointer items-center gap-2">
									<RadioGroupItem value="Private" id="private" />
									<span>Private</span>
								</label>
							</div>
						</RadioGroup>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};
