import MacosDesktop from "@/src/components/MacosDesktop";
import { hono } from "@/src/lib/hono-client";
import { headers } from "next/headers";

export default async function Page({ params }: { params: { osName: string } }) {
	const res = await hono.api.desktop[":osName"].state.$get(
		{
			param: {
				osName: params.osName,
			},
		},
		{
			init: {
				cache: "no-store",
				headers: await headers(),
			},
		},
	);
	const data = await res.json();
	if (res.status === 404 || !data) {
		return <div>No desktop information</div>;
	}
	return (
		<>
			<MacosDesktop desktop={data} osName={params.osName} />
		</>
	);
}
