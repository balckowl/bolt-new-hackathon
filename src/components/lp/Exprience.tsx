import { Chewy } from "next/font/google";
import { ArcadeEmbed } from "./ArcadeEmbed";
import Container from "./Container";

const chewy = Chewy({ subsets: ["latin"], weight: "400" });

export default function Exprience() {
	return (
		<section className="relative to-white px-4 py-[130px]">
			<Container>
				<h2 className={`${chewy.className} mb-20 text-center text-4xl text-black`}>Try The Demo</h2>
				<div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
					<ArcadeEmbed />
				</div>
			</Container>
		</section>
	);
}
