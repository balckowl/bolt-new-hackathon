import type { AllowedStampNamesType } from "@/src/server/models/os.schema";
import Image from "next/image";

type StampOption = {
	name: AllowedStampNamesType;
	src: string;
	alt: string;
};

export const stampOptions: StampOption[] = [
	{
		name: "astro-4",
		src: "/astro-4.png",
		alt: "astro-4",
	},
	{
		name: "astro-3",
		src: "/astro-3.png",
		alt: "astro-3",
	},
	{
		name: "astro-2",
		src: "/astro-2.png",
		alt: "astro-2",
	},
	{
		name: "astro",
		src: "/astro.png",
		alt: "astro",
	},
	{
		name: "browser",
		src: "/browser.png",
		alt: "browser",
	},
	{
		name: "rocket",
		src: "/rocket.png",
		alt: "rocket",
	},
	{
		name: "lock",
		src: "/lock.png",
		alt: "lock",
	},
	{
		name: "star",
		src: "/star.png",
		alt: "star",
	},
];

type Props = {
	dialogZIndex: number;
	visible: boolean;
	onSelectStamp: (stampId: string) => void;
};

export default function StampDialog({ dialogZIndex, visible, onSelectStamp }: Props) {
	const handleStampSelect = (stampId: string) => {
		onSelectStamp(stampId);
	};

	if (!visible) return null;

	return (
		<div
			className="dialog fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
			style={{ zIndex: dialogZIndex }}
		>
			<div className="stamp-dialog min-w-[400px] rounded-xl border border-gray-200 bg-white p-6 shadow-2xl">
				<h3 className="mb-4 font-semibold text-gray-800 text-lg">Create New Stamp</h3>
				<div className="mb-4 grid grid-cols-4 gap-4">
					{stampOptions.map((stamp) => (
						<Image
							key={stamp.name}
							src={stamp.src}
							width={80}
							height={80}
							alt={stamp.alt}
							className="h-20 w-20 cursor-pointer rounded-md border border-gray-200 object-cover transition-transform hover:scale-105"
							onClick={() => handleStampSelect(stamp.name)}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
