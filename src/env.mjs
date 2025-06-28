import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().url(),
		DIRECT_URL: z.string().url(),
		BETTER_AUTH_SECRET: z.string(),
		BETTER_AUTH_URL: z.string().url(),
		GOOGLE_CLIENT_ID: z.string(),
		GOOGLE_CLIENT_SECRET: z.string(),
		API_DOC_BASIC_AUTH_USER: z.string(),
		API_DOC_BASIC_AUTH_PASS: z.string(),
	},
	client: {
		NEXT_PUBLIC_APP_URL: z.string().url(),
	},
	runtimeEnv: {
		NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
		DATABASE_URL: process.env.DATABASE_URL,
		DIRECT_URL: process.env.DIRECT_URL,
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
		GOOGLE_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
		API_DOC_BASIC_AUTH_USER: process.env.API_DOC_BASIC_AUTH_USER,
		API_DOC_BASIC_AUTH_PASS: process.env.API_DOC_BASIC_AUTH_PASS,
	},
});
