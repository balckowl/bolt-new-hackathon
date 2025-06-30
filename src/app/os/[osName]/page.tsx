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
				cache: "force-cache",
				next: { tags: ["desktop"] },
				headers: headers(),
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
