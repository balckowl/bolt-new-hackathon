import { getTranslation } from "@/src/i18n/server";
import Image from "next/image";
import { Marquee } from "../../magicui/marquee";
import Container from "../layout/Container";
import SectionTitle from "../shared/SectionTitle";
import SeparatedWave from "../shared/SeparatedWave";
import { AppIconMock } from "./AppIconMock";
import { APPLIST } from "./AppList";

const highlightTags = [
	{
		color: "bg-gradient-to-br from-blue-400 via-blue-600 to-purple-800",
		label: "default",
		className: "left-3 top-4 -rotate-[8deg] sm:left-6",
	},
	{
		color: "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600",
		label: "warm",
		className: "left-0 top-1/2 -translate-y-1/2 -rotate-[4deg] sm:-left-4",
	},
	{
		color: "bg-gradient-to-br from-green-400 via-green-500 to-green-600",
		label: "green",
		className: "right-6 top-3 rotate-[5deg] sm:right-10",
	},
	{
		color: "bg-black",
		label: "black",
		className: "right-0 top-1/2 -translate-y-1/2 -rotate-[10deg] sm:-right-4",
	},
];

type Props = {
	lang: string;
};

export default async function CoreFunctions({ lang }: Props) {
	const { t } = await getTranslation(lang);
	const title = t("core_functions.title");
	const desc = t("core_functions.desc");
	const card1Title = t("core_functions.openWithinOspace.title");
	const card1Desc = t("core_functions.openWithinOspace.body");
	const card2Title = t("core_functions.chooseBackground.title");
	const card2Desc = t("core_functions.chooseBackground.body");
	const card3Title = t("core_functions.privacy.title");
	const card3Desc = t("core_functions.privacy.body");
	const card4Title = t("core_functions.turnSites.title");
	const card4Desc = t("core_functions.turnSites.body");

	return (
		<section className="relative bg-[#111827] px-[10px] pt-[50px] pb-[130px] md:pt-[120px] md:pb-[200px] ">
			<Container>
				<SectionTitle title={title} desc={desc} />
				<div className="grid grid-cols-1 gap-5 md:grid-cols-6">
					<div className="relative h-[250px] overflow-hidden rounded-xl bg-black px-5 py-5 md:col-span-3">
						<h3 className="mb-1 font-semibold text-lg text-white backdrop-blur-md md:text-xl">
							{card1Title}
						</h3>
						<p className="mb-2 text-[#5f5f5f] text-xs sm:mb-0 sm:text-sm">{card1Desc}</p>
						<Image
							src="/browser.png"
							width={480}
							height={300}
							alt="hono"
							className="sm:-bottom-[180px] sm:-left-[70px] absolute rounded-xl"
						/>
						<Image
							src="/browser.png"
							width={480}
							height={300}
							alt="hono"
							className="-bottom-[150px] -right-[100px] absolute rotate-[2deg] rounded-xl"
						/>
					</div>
					<div className="relative h-[250px] overflow-hidden rounded-xl bg-black px-5 py-5 md:col-span-3">
						<h3 className="mb-1 font-semibold text-lg text-white backdrop-blur-md md:text-xl">
							{card2Title}
						</h3>
						<p className="mb-3 text-[#5f5f5f] text-xs sm:text-sm">{card2Desc}</p>
						<div className="relative flex min-h-[220px] items-center justify-center">
							{highlightTags.map((tag) => (
								<div
									key={`${tag.label}-${tag.className}`}
									className={`absolute z-10 flex items-center gap-1 rounded-full bg-white px-2 py-[2px] shadow-sm transition sm:px-3 ${tag.className}`}
								>
									<div className={`h-4 w-4 rounded-full ${tag.color}`} />
									<p className="text-xs sm:text-base">{tag.label}</p>
								</div>
							))}
							<Image
								src="/astro-2.png"
								width={200}
								height={100}
								alt="hono"
								className="relative z-20"
							/>
						</div>
					</div>
					<div className="rounded-xl bg-black p-5 md:col-span-2">
						<h3 className="mb-1 font-semibold text-lg text-white backdrop-blur-md md:text-xl">
							{card3Title}
						</h3>
						<p className="mb-3 text-[#5f5f5f] text-xs sm:text-sm">{card3Desc}</p>
						<div className="flex h-[150px] items-center justify-center overflow-hidden">
							<Image src="/lock.png" width={80} height={80} alt="lock" />
						</div>
					</div>
					<div className="rounded-xl bg-black px-5 py-5 md:col-span-4">
						<h3 className="mb-1 font-semibold text-lg text-white backdrop-blur-md md:text-xl">
							{card4Title}
						</h3>
						<p className="mb-3 text-[#5f5f5f] text-xs sm:text-sm">{card4Desc}</p>
						<div className="flex h-[150px] items-center">
							<Marquee pauseOnHover className="[--duration:20s]">
								{APPLIST.map((app, index) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									<AppIconMock key={index} notifyIcon={app.name === "folder"}>
										{app.type === "image" ? (
											<Image src={app.icon} width={35} height={35} alt="icon" />
										) : (
											app.icon
										)}
									</AppIconMock>
								))}
							</Marquee>
						</div>
					</div>
				</div>
			</Container>
			<SeparatedWave color="#000000" />
		</section>
	);
}
