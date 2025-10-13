import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LpWrapper from "../../components/lp/layout/LpWrapper";
import { auth } from "../../lib/auth";

type Props = {
	params: { lang: string };
};

export default async function Page({ params }: Props) {
	const { lang } = params;

	const session = await auth.api.getSession({
		headers: headers(),
	});

	if (!session) {
		return <LpWrapper lang={lang} />;
	}

	if (!session.user.osName) {
		redirect("/enter/callback/welcome");
	}

	redirect(`/os/${session.user.osName}`);
}
