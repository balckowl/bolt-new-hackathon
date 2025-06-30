import { auth } from "@/src/lib/auth";
import { createAuthClient } from "better-auth/client";
import { headers } from "next/headers";
export const authClient = createAuthClient();

export const signIn = async () => {
	const data = await authClient.signIn.social({
		provider: "google",
		callbackURL: "/enter/callback/welcome",
	});
};

export const signOut = async () => {
	const data = await authClient.signOut();
};
