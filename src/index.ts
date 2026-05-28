import "./instrumentation";
import { Hono } from "hono";
import { loadConfig } from "./lib/config";

const config = loadConfig();

export const app = new Hono();

app.get("/", (c) => c.json({ message: "ok" }));
app.get("/health", (c) => c.json({ ok: true, version: config.appVersion }));

export default { port: config.port, fetch: app.fetch };
