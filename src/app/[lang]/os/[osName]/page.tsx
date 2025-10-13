import { backgroundOptions } from "@/src/components/BackgroundImage";
import LockView from "@/src/components/LockView";
import MacosDesktop from "@/src/components/MacosDesktop";
import MobileLockView from "@/src/components/MobileLockView";
import { hono } from "@/src/lib/hono-client";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

type Props = {
	params: { osName: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	return {
		title: `${params.osName}'s OS`,
		description: `This is ${params.osName}'s OS page.`,
		openGraph: {
			title: `${params.osName}'s OS`,
			description: `This is ${params.osName}'s OS page.`,
		},
	};
}

export default async function Page({ params }: Props) {
	const cookieHeader = cookies().toString();

	const res = await hono.api.desktop[":osName"].state.$get(
		{
			param: {
				osName: params.osName,
			},
		},
		{
			init: {
				cache: "force-cache",
				next: { tags: ["desktop"] },
				headers: { cookie: cookieHeader },
			},
		},
	);

	if (res.status === 404) {
		notFound();
	}

	if (res.status === 403) {
		return <LockView osName={params.osName} />;
	}

	const data = await res.json();
	const backgroundImg = backgroundOptions.find((opt) => opt.name === data.background);
	return (
		<>
			<div className="block lg:hidden">
				<MobileLockView />
			</div>
			<div className="hidden lg:block">
				<MacosDesktop desktop={data} osName={params.osName} backgroundImg={backgroundImg} />
			</div>
		</>
	);
}
