//server/hono.ts
import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import type { Env } from "hono";
import { basicAuth } from "hono/basic-auth";
import { except } from "hono/combine";
import { env } from "../env.mjs";
import {
	getDesktopStateHandler,
	updateDesktopBackgroundHandler,
	updateDesktopStateHandler,
	updateDesktopVisibilityHandler,
} from "./controllers/os.controller";
import { checkOsNameHandler, setOsNameHandler } from "./controllers/user.controller";
import { type WithAuthenticatedRequest, authMiddleware } from "./middleware/authMIddleware";
import {
	getDesktopStateRoute,
	updateBackgroundRoute,
	updateDesktopStateRoute,
	updateVisibilityRoute,
} from "./routes/os.route";
import { checkOsNameRoute, setOsNameRoute } from "./routes/user.route";

export const app = new OpenAPIHono().basePath("/api");

const osApp = new OpenAPIHono<Env & WithAuthenticatedRequest>()
	.openapi(checkOsNameRoute, checkOsNameHandler)
	.openapi(setOsNameRoute, setOsNameHandler)
	.openapi(getDesktopStateRoute, getDesktopStateHandler)
	.openapi(updateDesktopStateRoute, updateDesktopStateHandler)
	.openapi(updateVisibilityRoute, updateDesktopVisibilityHandler)
	.openapi(updateBackgroundRoute, updateDesktopBackgroundHandler);

app
	.doc("/specification", {
		openapi: "3.0.0",
		info: { title: "Bolt New Hackathon", version: "1.0.0" },
	})
	.use("/doc/*", async (c, next) => {
		const auth = basicAuth({
			username: env.API_DOC_BASIC_AUTH_USER,
			password: env.API_DOC_BASIC_AUTH_PASS,
		});
		return auth(c, next);
	})
	.get("/doc", Scalar({ url: "/api/specification" }));

app.use(except("/api/desktop/:osName/state", authMiddleware));
const route = app.route("/", osApp);

export type AppType = typeof route;
export default app;
