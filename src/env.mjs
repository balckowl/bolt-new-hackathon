import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().url(),
		DIRECT_URL: z.string().url(),
		BETTER_AUTH_SECRET: z.string(),
		BETTER_AUTH_URL: z.string().url(),
		GITHUB_CLIENT_ID: z.string(),
		GITHUB_CLIENT_SECRET: z.string(),
	},
	client: {},
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		DIRECT_URL: process.env.DIRECT_URL,
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
		GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
		GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
	},
});
