"use client";

import { useTranslation } from "@/src/i18n/client";
import { availableLanguages } from "@/src/i18n/settings";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "../../ui/select";

export function LangChanger({ lang }: { lang: string }) {
	const pathname = usePathname() || "/";
	// biome-ignore lint/style/useTemplate: <explanation>
	const strip = (p: string) => "/" + p.split("/").slice(2).join("/"); // 先頭の /{locale} を除去
	const rest = strip(pathname);
	const { i18n } = useTranslation(lang);
	const router = useRouter();

	return (
		<Select
			value={lang}
			defaultValue={i18n.resolvedLanguage}
			onValueChange={(l) => router.push(`/${l}${rest}`)}
		>
			<SelectTrigger className="w-[130px] border-0 shadow-none outline-none ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 data-[state=open]:ring-0 data-[state=open]:ring-offset-0">
				<SelectValue placeholder="Select a fruit" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{availableLanguages.map((l) => (
						<SelectItem value={l} key={l}>
							{l.toUpperCase()}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
