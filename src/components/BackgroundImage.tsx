import type { BackgroundOptionType } from "@/prisma/prisma/zod";
import Image from "next/image";
import { env } from "../env.mjs";

export type BackgroundOption = {
	id: string;
	name: BackgroundOptionType;
	value: string;
	preview: React.ReactNode;
};

export const backgroundOptions: BackgroundOption[] = [
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
