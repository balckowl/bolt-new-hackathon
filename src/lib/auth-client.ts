import { createAuthClient } from "better-auth/client";
export const authClient = createAuthClient();

export const signIn = async () => {
	const data = await authClient.signIn.social({
		provider: "google",
		callbackURL: "/enter/callback/welcome",
	});
};

export const signOut = async (isPublic: boolean) => {
	await authClient.signOut({
		fetchOptions: {
			onSuccess: () => {
				window.location.reload();
				if (!isPublic) {
					window.location.href = "/";
				}
			},
		},
	});
};
