import LoginWrapper from "@/src/components/onboarding/LoginWrapper";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
	const session = await auth.api.getSession({
		headers: headers(),
	});

	if (!session) {
		return <LoginWrapper />;
	}

	if (!session.user.osName) {
		redirect("/enter/callback/welcome");
	}

	redirect(`/os/${session.user.osName}`);
}
