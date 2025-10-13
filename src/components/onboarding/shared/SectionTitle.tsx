import { Lilita_One } from "next/font/google";

type Props = {
	title: string;
	desc: string;
	ex?: boolean;
};

const chewy = Lilita_One({ subsets: ["latin"], weight: "400" });

export default function SectionTitle({ title, desc, ex = false }: Props) {
	return (
		<div className="mt-2 mb-5 text-center">
			<h2
				className={`mb-3 flex justify-center gap-1 font-bold text-3xl text-white ${chewy.className}`}
			>
				{title}
				{ex && <span className="block rotate-[10deg]">!</span>}
			</h2>
			<p className="text-center text-sm text-white/50 uppercase tracking-[0.4em]">{desc}</p>
		</div>
	);
}
