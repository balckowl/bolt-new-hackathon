import { ArcadeEmbed } from "./ArcadeEmbed";

type Props = {
	scrollY: number;
};

export default function Exprience({ scrollY }: Props) {
	return (
		<section
			className="relative px-4 py-[130px]"
			style={{
				transform: `translateY(${scrollY * 0.04}px)`,
			}}
		>
			<div className="mx-auto max-w-6xl">
				<div className="mb-8 text-center">
					<h2 className="mb-4 font-bold text-4xl text-gray-800">Experience</h2>
				</div>

				{/* Enlarged Safari-style Browser Window */}
				<div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
					<ArcadeEmbed />
				</div>
			</div>
		</section>
	);
}
