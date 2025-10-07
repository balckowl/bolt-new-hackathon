import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import type { AllowedStampNamesType } from "@/src/server/models/os.schema";
import Image from "next/image";

type StampOption = {
	name: AllowedStampNamesType;
	src: string;
	alt: string;
	type: "emoji" | "wakusei" | "original";
};

export const stampOptions: StampOption[] = [
	{
		name: "stamp-1",
		src: "/stamp-1.png",
		alt: "stamp-1",
		type: "emoji",
	},
	{
		name: "stamp-2",
		src: "/stamp-2.png",
		alt: "stamp-2",
		type: "emoji",
	},
	{
		name: "stamp-3",
		src: "/stamp-3.png",
		alt: "stamp-3",
		type: "emoji",
	},
	{
		name: "astro-6",
		src: "/astro-6.png",
		alt: "astro-6",
		type: "original",
	},
	{
		name: "astro-7",
		src: "/astro-7.png",
		alt: "astro-7",
		type: "original",
	},
	{
		name: "astro-8",
		src: "/astro-8.png",
		alt: "astro-8",
		type: "original",
	},
	{
		name: "astro-10",
		src: "/astro-10.png",
		alt: "astro-10",
		type: "original",
	},
	{
		name: "astro-11",
		src: "/astro-11.png",
		alt: "astro-11",
		type: "original",
	},
	{
		name: "astro-12",
		src: "/astro-12.png",
		alt: "astro-12",
		type: "original",
	},
	{
		name: "wakusei-2",
		src: "/wakusei-2.png",
		alt: "wakusei-2",
		type: "wakusei",
	},
	{
		name: "wakusei-3",
		src: "/wakusei-3.png",
		alt: "wakusei-3",
		type: "wakusei",
	},
	{
		name: "wakusei-4",
		src: "/wakusei-4.png",
		alt: "wakusei-4",
		type: "wakusei",
	},
	{
		name: "wakusei",
		src: "/wakusei.png",
		alt: "wakusei",
		type: "wakusei",
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

	const stampTypes: Array<StampOption["type"]> = ["emoji", "wakusei", "original"];
	const stampTypeLabels: Record<StampOption["type"], string> = {
		emoji: "Emoji",
		wakusei: "Wakusei",
		original: "Original",
	};

	if (!visible) return null;

	return (
		<div
			className="dialog fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
			style={{ zIndex: dialogZIndex }}
		>
			<div className="stamp-dialog min-h-[270px] min-w-[450px] rounded-xl bg-white p-[10px] shadow-2xl">
				<Tabs defaultValue={stampTypes[0]}>
					<TabsList className="mb-2 gap-2 bg-transparent p-0">
						{stampTypes.map((type) => (
							<TabsTrigger
								asChild
								key={type}
								value={type}
								className="h-10 w-10 flex-1 rounded-md bg-white p-0 font-medium text-sm transition-colors data-[state=active]:bg-black/10 data-[state=active]:text-white"
							>
								<button type="button">
									{stampTypeLabels[type] === "Emoji" && (
										<Image src="/stamp-1.png" width={30} height={30} alt="emoji" />
									)}
									{stampTypeLabels[type] === "Wakusei" && (
										<Image src="/wakusei-4.png" width={30} height={30} alt="wakusei" />
									)}
									{stampTypeLabels[type] === "Original" && (
										<Image src="/astro-8.png" width={30} height={30} alt="original" />
									)}
								</button>
							</TabsTrigger>
						))}
					</TabsList>

					{stampTypes.map((type) => (
						<TabsContent key={type} value={type}>
							<div className="grid grid-cols-4 gap-4 px-3">
								{stampOptions
									.filter((stamp) => stamp.type === type)
									.map((stamp) => (
										<Image
											key={stamp.name}
											src={stamp.src}
											width={80}
											height={80}
											alt={stamp.alt}
											className="h-20 w-20 cursor-pointer rounded-md object-cover transition-transform hover:scale-105"
											onClick={() => handleStampSelect(stamp.name)}
										/>
									))}
							</div>
						</TabsContent>
					))}
				</Tabs>
			</div>
		</div>
	);
}
