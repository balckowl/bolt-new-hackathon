//lib/hono.ts
import type { AppType } from "@/src/server/hono";
import { hc } from "hono/client";
import { env } from "../env.mjs";

export const hono = hc<AppType>(`https://${env.NEXT_PUBLIC_VERCEL_URL}`);
