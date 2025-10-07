"use client";

import type { BackgroundOptionType } from "@/prisma/prisma/zod";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { hono } from "@/src/lib/hono-client";
import { Check, Paintbrush } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { backgroundOptions } from "./BackgroundImage";

interface BackgroundSelectorProps {
	onBackgroundChange: (background: string) => void;
	currentBackground: string;
	setBackground: (background: string) => void;
}

export function BackgroundSelector({
	onBackgroundChange,
	currentBackground,
	setBackground,
}: BackgroundSelectorProps) {
	const [open, setOpen] = useState(false);

	const handleBackgroundChange = async (name: BackgroundOptionType, value: string) => {
		toast.dismiss();
		onBackgroundChange(value);
		if (currentBackground === value) return;
		try {
			const res = await hono.api.desktop.background.$put({
				json: {
					background: name,
				},
			});
			if (!res.ok) {
				toast("Background change failed", {
					style: { color: "#dc2626" },
					icon: <Paintbrush size={19} />,
					className: "text-sm",
				});
				return;
			}
			toast("Background changed", {
				icon: <Paintbrush size={19} />,
				className: "text-sm font-bold",
				style: {
					fontWeight: "700",
				},
			});
			setBackground(value);
			setOpen(false);
		} catch (e) {
			toast("Background change failed", {
				style: { color: "#dc2626" },
				icon: <Paintbrush size={19} />,
				className: "text-sm",
			});
			console.error("Failed to update visibility:", e);
		}
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					className="flex h-9 w-9 items-center justify-center rounded-full text-sm text-white hover:bg-white/20"
				>
					<Paintbrush size={17} />
				</button>
			</PopoverTrigger>
			<PopoverContent
				className="hadow-xl w-[480px] rounded-2xl border-0 bg-white/90 p-[14px]"
				align="center"
				sideOffset={15}
			>
				<div className="space-y-3">
					<div className="grid grid-cols-3 gap-3">
						{backgroundOptions.map((option) => {
							const isSelected = currentBackground === option.value;
							return (
								<button
									key={option.id}
									onClick={() => handleBackgroundChange(option.name, option.value)}
									className="group relative aspect-video overflow-hidden rounded-lg transition-all duration-200 hover:scale-[1.03]"
									type="button"
								>
									{option.preview}
									{isSelected && (
										<div className="absolute inset-0 flex items-center justify-center bg-blue-500/20">
											<div className="flex h-6 w-6 items-center justify-center rounded-full bg-black">
												<Check width={17} height={17} color="white" />
											</div>
										</div>
									)}
								</button>
							);
						})}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
