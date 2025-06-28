import MacosDesktop from "@/src/components/MacosDesktop";
import { hono } from "@/src/lib/hono-client";
import type { desktopStateSchema } from "@/src/server/models/os.schema";
import { headers } from "next/headers";
import type z from "zod";

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
	if (!res.ok) {
		return <div>Failed to get information</div>;
	}
	const data: z.infer<typeof desktopStateSchema> = await res.json();
	return (
		<>
			<MacosDesktop desktop={data} />
		</>
	);
}
