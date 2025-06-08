import { swaggerUI } from "@hono/swagger-ui";
//server/hono.ts
import { OpenAPIHono } from "@hono/zod-openapi";
import { checkOsNameHandler } from "./controllers/user.controller";
import { checkOsNameRoute } from "./routes/user.route";

export const app = new OpenAPIHono().basePath("/api");

const osApp = new OpenAPIHono().openapi(checkOsNameRoute, checkOsNameHandler);

app.route("/", osApp);

app
	.doc("/specification", {
		openapi: "3.0.0",
		info: { title: "Bolt New Hackathon", version: "1.0.0" },
	})
	.get("/doc", swaggerUI({ url: "/api/specification" }));

export default app;
