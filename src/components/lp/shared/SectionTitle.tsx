import { Lilita_One } from "next/font/google";

type Props = {
	title: string;
	desc: string;
};

const litteOne = Lilita_One({ subsets: ["latin"], weight: "400" });

export default function SectionTitle({ title, desc }: Props) {
	return (
		<div className="mx-auto mb-8 max-w-3xl text-center md:mb-20">
			<h2 className={`${litteOne.className} font-bold text-2xl text-white sm:text-3xl md:text-4xl`}>
				{title}
			</h2>
			<p className="mt-5 text-white/50 text-xs uppercase tracking-[0.4em] md:text-sm">{desc}</p>
		</div>
	);
}
