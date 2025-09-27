import LoginWrapper from "@/src/components/onboarding/LoginWrapper";
import { auth } from "@/src/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Login",
};

type Props = {
	params: { lang: string };
};

export default async function Page({ params }: Props) {
	const { lang } = params;
	const session = await auth.api.getSession({
		headers: headers(),
	});

	if (!session) {
		return <LoginWrapper lang={lang} />;
	}

	if (!session.user.osName) {
		redirect("/enter/callback/welcome");
	}

	redirect(`/os/${session.user.osName}`);
}
