import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LpWrapper from "../components/lp/LpWrapper";
import { auth } from "../lib/auth";

export default async function Page() {
	const session = await auth.api.getSession({
		headers: headers(),
	});

	if (!session) {
		return <LpWrapper />;
	}

	if (!session.user.osName) {
		redirect("/enter/callback/welcome");
	}

	redirect(`/os/${session.user.osName}`);
}
