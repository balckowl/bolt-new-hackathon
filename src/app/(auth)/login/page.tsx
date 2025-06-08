"use client";

import { Button } from "@/src/components/ui/button";
import { signIn } from "@/src/lib/auth-client";

export default function Page() {
	return (
		<Button type="button" onClick={signIn}>
			ログイン
		</Button>
	);
}
