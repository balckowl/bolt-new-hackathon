"use client";

import type { BackgroundOptionType } from "@/prisma/prisma/zod";
import { Button } from "@/src/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { hono } from "@/src/lib/hono-client";
import { ChevronDown, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface BackgroundSelectorProps {
	onBackgroundChange: (background: string) => void;
	currentBackground: string;
	setBackground: (background: string) => void;
}

export const backgroundOptions: {
	id: string;
	name: BackgroundOptionType;
	value: string;
	preview: React.ReactNode;
}[] = [
	{
		id: "gradient",
		name: "SUNSET",
		value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
		preview: (
			<div className="h-full w-full rounded bg-gradient-to-br from-blue-400 to-purple-600" />
		),
	},
	// {
	// 	id: "mountain",
	// 	name: "Mountain Vista",
	// 	value:
	// 		"https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
	// 	preview: (
	// 		<img
	// 			src="https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=200&h=120&fit=crop"
	// 			alt="Mountain Vista"
	// 			className="h-full w-full rounded object-cover"
	// 		/>
	// 	),
	// },
	{
		id: "ocean",
		name: "OCEAN",
		value:
			"https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
		preview: (
			<Image
				src="https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=200&h=120&fit=crop"
				alt="Ocean Waves"
				className="h-full w-full rounded object-cover"
				width={500}
				height={300}
				priority
			/>
		),
	},
	{
		id: "forest",
		name: "FOREST",
		value:
			"https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
		preview: (
			<Image
				src="https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?auto=compress&cs=tinysrgb&w=200&h=120&fit=crop"
				alt="Forest Path"
				className="h-full w-full rounded object-cover"
				width={500}
				height={300}
				priority
			/>
		),
	},
	// {
	// 	id: "city",
	// 	name: "City Skyline",
	// 	value:
	// 		"https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
	// 	preview: (
	// 		<img
	// 			src="https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&cs=tinysrgb&w=200&h=120&fit=crop"
	// 			alt="City Skyline"
	// 			className="h-full w-full rounded object-cover"
	// 		/>
	// 	),
	// },
	// {
	// 	id: "desert",
	// 	name: "Desert Dunes",
	// 	value:
	// 		"https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
	// 	preview: (
	// 		<img
	// 			src="https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=200&h=120&fit=crop"
	// 			alt="Desert Dunes"
	// 			className="h-full w-full rounded object-cover"
	// 		/>
	// 	),
	// },
];

export function BackgroundSelector({
	onBackgroundChange,
	currentBackground,
	setBackground,
}: BackgroundSelectorProps) {
	const [open, setOpen] = useState(false);

	const handleBackgroundChange = async (name: BackgroundOptionType, value: string) => {
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
				});
				return;
			}
			toast("background changed");
			setBackground(value);
			setOpen(false);
		} catch (e) {
			toast("Background change failed", {
				style: { color: "#dc2626" },
			});
			console.error("Failed to update visibility:", e);
		}
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="sm" className="h-6 px-2 text-white text-xs hover:bg-white/10">
					<ImageIcon className="mr-1 h-3 w-3" />
					Background
					<ChevronDown className="ml-1 h-3 w-3" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-[480px] border border-white/20 bg-white/95 p-4 shadow-xl backdrop-blur-md"
				align="start"
				side="bottom"
				sideOffset={8}
			>
				<div className="space-y-3">
					<h3 className="font-medium text-gray-900 text-sm">Choose Background</h3>
					<div className="grid grid-cols-3 gap-3">
						{backgroundOptions.map((option) => {
							const isSelected = currentBackground === option.value;
							return (
								<button
									key={option.id}
									onClick={() => handleBackgroundChange(option.name, option.value)}
									className={`group relative aspect-video overflow-hidden rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
										isSelected
											? "border-blue-500 ring-2 ring-blue-200"
											: "border-gray-200 hover:border-gray-300"
									}`}
									type="button"
								>
									{option.preview}
									{isSelected && (
										<div className="absolute inset-0 flex items-center justify-center bg-blue-500/20">
											<div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
												<svg
													className="h-4 w-4 text-white\"
													fill="currentColor\"
													viewBox="0 0 20 20"
												>
													<title>Check</title>
													<path
														fillRule="evenodd"
														d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\"
														clipRule="evenodd"
													/>
												</svg>
											</div>
										</div>
									)}
									<div className="absolute right-0 bottom-0 left-0 bg-black/60 p-2 text-white text-xs opacity-0 transition-opacity group-hover:opacity-100">
										{option.name}
									</div>
								</button>
							);
						})}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
