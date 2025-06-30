import MacosDesktop from "@/src/components/MacosDesktop";
import { hono } from "@/src/lib/hono-client";
import type { Metadata } from "next";
import { cookies } from "next/headers";

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
		return <div>No desktop information</div>;
	}

	if (res.status === 403) {
		return <div>This OS is not available for viewing.</div>;
	}

	const data = await res.json();
	return (
		<>
			<MacosDesktop desktop={data} osName={params.osName} />
		</>
	);
}
