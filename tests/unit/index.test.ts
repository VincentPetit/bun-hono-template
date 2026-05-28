import { beforeAll, describe, expect, test } from "bun:test";
import type { Hono } from "hono";

// Set env before module load
process.env.PORT = process.env.PORT || "3000";

let app: Hono;

beforeAll(async () => {
  const mod = await import("../../src/index");
  app = mod.app;
});

describe("GET /", () => {
  test("returns 200 with ok message", async () => {
    const res = await app.fetch(new Request("http://localhost/"));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { message: string };
    expect(body.message).toBe("ok");
  });
});

describe("GET /health", () => {
  test("returns ok: true and non-empty version string", async () => {
    const res = await app.fetch(new Request("http://localhost/health"));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; version: string };
    expect(body.ok).toBe(true);
    expect(typeof body.version).toBe("string");
    expect(body.version.length).toBeGreaterThan(0);
  });
});
