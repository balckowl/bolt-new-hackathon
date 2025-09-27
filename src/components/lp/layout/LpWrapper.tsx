import { LanguageProvider } from "@/src/i18n/client";
import { getTranslation } from "@/src/i18n/server";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { Button } from "../../ui/button";
import CoreFunctions from "../corefunctions/CoreFunctions";
import Exprience from "../experience/Exprience";
import Hero from "../hero/Hero";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import Recommend from "../recommend/Recommend";
import { LangChanger } from "../shared/LangChanger";

type Props = {
	lang: string;
};

export default async function LpWrapper({ lang }: Props) {
	const { t } = await getTranslation(lang);
	const getStarted = t("get_started");

	return (
		<Fragment>
			<Header>
				{/* <Button className="rounded-xl" asChild>
          <Link href="/login">
            {getStarted} <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button> */}
				<LanguageProvider initialLanguage={lang}>
					<LangChanger lang={lang} />
				</LanguageProvider>
			</Header>
			<div className="h-[calc(70px+30px)] bg-[#0B0C10]" />
			<Hero lang={lang} />
			<CoreFunctions lang={lang} />
			<Exprience lang={lang} />
			<Recommend lang={lang} />
			<Footer />
		</Fragment>
	);
}
