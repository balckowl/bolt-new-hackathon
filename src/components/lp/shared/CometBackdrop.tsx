import { Meteors } from "../../magicui/meteors";

type CometLayer = {
	id: string;
	number: number;
	minDelay: number;
	maxDelay: number;
	minDuration: number;
	maxDuration: number;
	angle: number;
	className: string;
};

const COMET_LAYERS: readonly CometLayer[] = [
	{
		id: "foreground",
		number: 14,
		minDelay: 0.1,
		maxDelay: 1.4,
		minDuration: 4,
		maxDuration: 8,
		angle: 210,
		className: "opacity-70",
	},
	{
		id: "midground",
		number: 10,
		minDelay: 0.6,
		maxDelay: 2.2,
		minDuration: 6,
		maxDuration: 12,
		angle: 220,
		className: "opacity-50 blur-[0.5px]",
	},
	{
		id: "background",
		number: 8,
		minDelay: 1,
		maxDelay: 3,
		minDuration: 8,
		maxDuration: 16,
		angle: 200,
		className: "opacity-40 blur-[1px]",
	},
] as const;

export function CometBackdrop() {
	return (
		<div className="pointer-events-none absolute inset-0 overflow-hidden">
			{COMET_LAYERS.map((layer) => (
				<Meteors
					key={`core-functions-comet-layer-${layer.id}`}
					number={layer.number}
					minDelay={layer.minDelay}
					maxDelay={layer.maxDelay}
					minDuration={layer.minDuration}
					maxDuration={layer.maxDuration}
					angle={layer.angle}
					className={layer.className}
				/>
			))}
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
		</div>
	);
}
