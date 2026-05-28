import "./instrumentation";
import { httpInstrumentationMiddleware } from "@hono/otel";
import { Hono } from "hono";
import { shutdownOtel } from "./instrumentation";
import { loadConfig } from "./lib/config";

const config = loadConfig();

export const app = new Hono();

app.use(httpInstrumentationMiddleware());

app.get("/", (c) => c.json({ message: "ok" }));
app.get("/health", (c) => c.json({ ok: true, version: config.appVersion }));

process.on("SIGTERM", () => shutdownOtel().finally(() => process.exit(0)));
process.on("SIGINT", () => shutdownOtel().finally(() => process.exit(0)));

export default { port: config.port, fetch: app.fetch };
