"use client";

import { Button } from "@/src/components/ui/button";
import { useTranslation } from "@/src/i18n/client";
import { authClient } from "@/src/lib/auth-client";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Header from "../lp/layout/Header";
import { StarryBackdrop } from "../lp/shared/StarryBackdrop";
import SectionTitle from "./shared/SectionTitle";

type Props = {
	lang: string;
};

export default function LoginWrapper({ lang }: Props) {
	const { t } = useTranslation(lang);
	const title = t("login.title");
	const desc = t("login.desc");
	const btn = t("login.btn");
	// const agreement = t("login.agreement");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await authClient.signIn.social({
				provider: "google",
				callbackURL: "/enter/callback/welcome",
			});
		} catch (error) {
			console.error("Login error:", error);
			setIsSubmitting(false);
		}
	};

	return (
		<div className="bg-black">
			<StarryBackdrop />
			<Header />
			<div className="flex min-h-[calc(100dvh-70px)] items-center justify-center px-4">
				<div>
					<SectionTitle title={title} desc={desc} ex={true} />

					<Button
						onClick={handleSubmit}
						className="itmes-center relative z-20 mx-auto mb-5 flex w-full gap-3 rounded-xl"
						type="button"
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<Loader2 className="animate-spin" width={15} height={15} />
						) : (
							<Image src="/google.svg" width={15} height={15} alt="google" />
						)}
						{btn}
					</Button>

					{lang === "en" && (
						<p className="mx-auto max-w-[380px] text-balance px-10 text-center text-white text-white/50 text-xs leading-1 leading-[1.5] tracking-wide">
							By continuing, you agree to{" "}
							<Link href="/legal" className="underline underline-offset-1">
								terms of service and privacy policy.
							</Link>
						</p>
					)}
					{lang === "ja" && (
						<p className="mx-auto max-w-[380px] text-balance px-10 text-center text-white text-white/50 text-xs leading-1 leading-[1.5] tracking-wide">
							続行すると、{" "}
							<Link href="/legal" className="underline underline-offset-1">
								利用規約とプライバシーポリシー
							</Link>
							に同意したことになります。
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
