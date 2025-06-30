import WelcomeWrapper from "@/src/components/onboarding/WelcomeWrapper";
import { auth } from "@/src/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Welcome",
};

export default async function Page() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	//ログインしてないのならログインページへ
	if (!session?.user?.id) return redirect("/login");
	//OSNameが設定されているのなら、それぞれのOSへ
	if (session.user.osName) redirect(`/os/${session.user.osName}`);

	return <WelcomeWrapper />;
}
