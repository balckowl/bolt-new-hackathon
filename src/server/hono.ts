//server/hono.ts
import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import {
	getDesktopStateHandler,
	updateDesktopBackgroundHandler,
	updateDesktopStateHandler,
	updateDesktopVisibilityHandler,
} from "./controllers/os.controller";
import { checkOsNameHandler, setOsNameHandler } from "./controllers/user.controller";
import {
	getDesktopStateRoute,
	updateBackgroundRoute,
	updateDesktopStateRoute,
	updateVisibilityRoute,
} from "./routes/os.route";
import { checkOsNameRoute, setOsNameRoute } from "./routes/user.route";

export const app = new OpenAPIHono().basePath("/api");

const osApp = new OpenAPIHono()
	.openapi(checkOsNameRoute, checkOsNameHandler)
	.openapi(setOsNameRoute, setOsNameHandler)
	.openapi(getDesktopStateRoute, getDesktopStateHandler)
	.openapi(updateDesktopStateRoute, updateDesktopStateHandler)
	.openapi(updateVisibilityRoute, updateDesktopVisibilityHandler)
	.openapi(updateBackgroundRoute, updateDesktopBackgroundHandler);

const route = app.route("/", osApp);

app
	.doc("/specification", {
		openapi: "3.0.0",
		info: { title: "Bolt New Hackathon", version: "1.0.0" },
	})
	.get("/doc", Scalar({ url: "/api/specification" }));

export type AppType = typeof route;
export default app;
