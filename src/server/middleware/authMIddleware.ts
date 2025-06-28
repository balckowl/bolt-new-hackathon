import { auth } from "@/src/lib/auth";
import type { Session } from "better-auth";
import type { MiddlewareHandler } from "hono";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export type WithAuthenticatedRequest = { Variables: { userId: Session["userId"] } };

export const authMiddleware: MiddlewareHandler<WithAuthenticatedRequest> = createMiddleware(
	async (c, next) => {
		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		});

		if (!session?.user?.id) {
			throw new HTTPException(401, { message: "認証が必要です。" });
		}

		c.set("userId", session.user.id);

		await next();
	},
);
