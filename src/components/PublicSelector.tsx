import { Button } from "@/src/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { hono } from "@/src/lib/hono-client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
	isPublic: boolean;
	setIsPublic: (isPublic: boolean) => void;
};

export const PublicSelector = ({ isPublic, setIsPublic }: Props) => {
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
				return;
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
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="sm" className="h-6 px-2 text-white text-xs hover:bg-white/10">
					{/* <Image className="mr-1 h-3 w-3" /> */}
					{isPublic ? "Public" : "Private"}
					<ChevronDown className="ml-1 h-3 w-3" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-[200px] border border-white/20 bg-white/95 p-4 shadow-xl backdrop-blur-md"
				align="start"
				side="bottom"
				sideOffset={8}
			>
				<div className="space-y-3 text-sm">
					<h3 className="font-medium text-gray-900 text-sm">Public or Private</h3>
					<div className="grid grid-cols-3 gap-3">
						<RadioGroup
							className="flex"
							value={isPublic ? "Public" : "Private"}
							onValueChange={(value) => handleChange(value === "Public")}
						>
							<label htmlFor="public" className="flex cursor-pointer items-center gap-2">
								<RadioGroupItem value="Public" id="public" />
								<span>Public</span>
							</label>
							<label htmlFor="private" className="flex cursor-pointer items-center gap-2">
								<RadioGroupItem value="Private" id="private" />
								<span>Private</span>
							</label>
						</RadioGroup>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};
