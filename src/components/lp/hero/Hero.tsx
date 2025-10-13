import { env } from "@/src/env.mjs";
import { getTranslation } from "@/src/i18n/server";
import { ArrowRight } from "lucide-react";
import { Lilita_One } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Safari } from "../../magicui/safari";
import { Button } from "../../ui/button";
import Container from "./../layout/Container";
import SeparatedWave from "./../shared/SeparatedWave";
import { StarryBackdrop } from "./../shared/StarryBackdrop";

export const litteOne = Lilita_One({ subsets: ["latin"], weight: "400" });

type Props = {
	lang: string;
};

export default async function Hero({ lang }: Props) {
	const { t } = await getTranslation(lang);
	const title = t("hero.title");
	const getStarted = t("get_started");

	return (
		<>
			<div className="-z-10 fixed top-0 left-0 h-[600px] w-full">
				<div className="h-full w-full bg-black" />
			</div>
			<div className="relative flex flex-col justify-end overflow-hidden bg-[#0B0C10]">
				<StarryBackdrop />
				<Container>
					<div className="relative z-10 space-y-7 pb-20 text-center lg:pb-0">
						<h2
							className={`text-center font-semibold text-2xl text-white sm:text-3xl md:text-4xl ${litteOne.className}`}
						>
							{/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
							<div dangerouslySetInnerHTML={{ __html: title }} />
						</h2>
						<Button className="rounded-xl px-5 py-4 text-md" asChild>
							<Link href={`/${lang}/login`}>
								{getStarted} <ArrowRight className="ml-2 h-5 w-5" />
							</Link>
						</Button>
						<Safari
							url={`${env.NEXT_PUBLIC_APP_URL}/os/ospace`}
							className="mx-auto hidden h-[360px] max-w-[830px] lg:block"
							height={520}
							videoSrc="/heromv.mp4"
						/>
					</div>
				</Container>
				<Image
					src="/astro.png"
					width={205}
					height={100}
					alt="astro"
					className="-bottom-[15px] absolute right-[100px] z-10 hidden xl:block"
				/>
				<Image
					src="/rocket.png"
					width={305}
					height={100}
					alt="rocket"
					className="absolute bottom-0 left-0 z-10 hidden xl:block"
				/>
				<SeparatedWave color="#111827" />
			</div>
		</>
	);
}
