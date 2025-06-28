import MacosDesktop from "@/src/components/MacosDesktop";
import { hono } from "@/src/lib/hono-client";
import { headers } from "next/headers";

export default async function Page({ params }: { params: { osName: string } }) {
	const res = await hono.api.desktop[":osName"].$get(
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
	if (res.status === 404) {
		return <div>No desktop information</div>;
	}
	const data = await res.json();
	return (
		<>
			<MacosDesktop desktop={data} />
		</>
	);
}
