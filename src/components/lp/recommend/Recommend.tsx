import { getTranslation } from "@/src/i18n/server";
import { ArrowRight } from "lucide-react";
import { Lilita_One } from "next/font/google";
import Link from "next/link";
import { Button } from "../../ui/button";

const lilitaOne = Lilita_One({ subsets: ["latin"], weight: "400" });

type Props = {
	lang: string;
};

export default async function Recommend({ lang }: Props) {
	const { t } = await getTranslation(lang);
	const title = t("recommend.title");
	const desc = t("recommend.desc");
	const getStarted = t("get_started");

	return (
		<section className="relative bg-white px-4 pt-20 pb-5 md:pb-20">
			<div className="mx-auto mb-20 max-w-4xl">
				<div className="border-none shadow-none">
					<div className="text-center">
						<h2
							className={`${lilitaOne.className} mb-8 text-2xl text-black sm:text-3xl md:text-4xl`}
						>
							{title}
						</h2>
						<p className="mb-8 text-gray-400 text-xs uppercase tracking-[0.4em] md:text-sm">
							{desc}
						</p>
						<Button className="rounded-xl" asChild>
							<Link href="/login">
								{getStarted} <ArrowRight className="ml-2 h-5 w-5" />
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
