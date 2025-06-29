"use client";

import type { BackgroundOptionType } from "@/prisma/prisma/zod";
import { Button } from "@/src/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { hono } from "@/src/lib/hono-client";
import { ChevronDown, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { env } from "../env.mjs";

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
		id: "default",
		name: "DEFAULT",
		value: "linear-gradient(to bottom right,#60A5FA,#2563EB,#6B21A8)",
		preview: (
			<div className="h-full w-full rounded bg-gradient-to-br from-blue-400 via-blue-600 to-purple-800" />
		),
	},
	{
		id: "warm",
		name: "WARM",
		value: "linear-gradient(to bottom right,#FACC15,#F97316,#DC2626)",
		preview: (
			<div className="h-full w-full rounded bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600" />
		),
	},
	{
		id: "green",
		name: "GREEN",
		value: "linear-gradient(to bottom right, #4ADE80, #22C55E, #16A34A)",
		preview: (
			<div className="h-full w-full rounded bg-gradient-to-br from-green-400 via-green-500 to-green-600" />
		),
	},
	{
		id: "black",
		name: "BLACK",
		value: "linear-gradient(to bottom right,#000)",
		preview: <div className="h-full w-full rounded bg-black" />,
	},
	{
		id: "sunset",
		name: "SUNSET",
		value: `${env.NEXT_PUBLIC_APP_URL}/background/sunset.png`,
		preview: (
			<Image
				src="/background/sunset.png"
				alt="Ocean Waves"
				className="h-full w-full rounded object-cover"
				width={500}
				height={300}
				priority
			/>
		),
	},
	{
		id: "station",
		name: "STATION",
		value: `${env.NEXT_PUBLIC_APP_URL}/background/station.png`,
		preview: (
			<Image
				src="/background/station.png"
				alt="Ocean Waves"
				className="h-full w-full rounded object-cover"
				width={500}
				height={300}
				priority
			/>
		),
	},
	{
		id: "ocean",
		name: "OCEAN",
		value: `${env.NEXT_PUBLIC_APP_URL}/background/sky.png`,
		preview: (
			<Image
				src="/background/sky.png"
				alt="Ocean Waves"
				className="h-full w-full rounded object-cover"
				width={500}
				height={300}
				priority
			/>
		),
	},
	{
		id: "sakura",
		name: "SAKURA",
		value: `${env.NEXT_PUBLIC_APP_URL}/background/sakura.png`,
		preview: (
			<Image
				src="/background/sakura.png"
				alt="Ocean Waves"
				className="h-full w-full rounded object-cover"
				width={500}
				height={300}
				priority
			/>
		),
	},
	{
		id: "mountain",
		name: "MOUNTAIN",
		value: `${env.NEXT_PUBLIC_APP_URL}/background/mountain.png`,
		preview: (
			<Image
				src="/background/mountain.png"
				alt="Ocean Waves"
				className="h-full w-full rounded object-cover"
				width={500}
				height={300}
				priority
			/>
		),
	},
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
