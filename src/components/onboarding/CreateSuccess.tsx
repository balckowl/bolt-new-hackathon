"use client";

import { Button } from "@/src/components/ui/button";
import { useTranslation } from "@/src/i18n/client";
import { Rocket } from "lucide-react";
import Link from "next/link";
import Header from "../lp/layout/Header";
import { StarryBackdrop } from "../lp/shared/StarryBackdrop";
import SectionTitle from "./shared/SectionTitle";

type Props = {
	osName: string;
	lang: string;
};

export default function CreateSuccess({ osName, lang }: Props) {
	const { t } = useTranslation(lang);
	const title = t("createSuccess.title", { osName });
	const desc = t("createSuccess.desc");
	const btn = t("createSuccess.btn");

	return (
		<div>
			<Header />
			<StarryBackdrop />
			<div className="flex min-h-[calc(100dvh-70px)] items-center justify-center bg-black px-4">
				<div className="w-full max-w-md">
					{/* Welcome Card with Icon Extending Beyond */}
					<div className="relative">
						{/* Welcome Card */}
						<div className="rounded-2xl p-8">
							<SectionTitle title={title} desc={desc} />

							{/* Go to OS Button */}
							<Button className="mx-auto flex items-center gap-2 rounded-xl font-medium text-lg text-white transition-all duration-200">
								<Link href={`/os/${osName}`} className="flex items-center gap-2">
									<Rocket width={15} height={15} />
									{btn}
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
