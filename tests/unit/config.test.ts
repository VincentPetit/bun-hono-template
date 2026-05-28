import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { loadConfig } from "../../src/lib/config";

const KEYS = ["PORT", "DATABASE_PATH", "SIGNOZ_ENDPOINT", "APP_VERSION", "NODE_ENV", "APPLICATION_NAME", "ENVIRONMENT"];
let saved: Record<string, string | undefined> = {};

beforeEach(() => {
  saved = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));
});

afterEach(() => {
  for (const key of KEYS) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
});

describe("loadConfig", () => {
  test("returns defaults when env vars are absent", () => {
    delete process.env.PORT;
    delete process.env.DATABASE_PATH;
    delete process.env.APP_VERSION;
    delete process.env.SIGNOZ_ENDPOINT;

    const config = loadConfig();

    expect(config.port).toBe(3000);
    expect(config.databasePath).toBe("./data/app.db");
    expect(config.appVersion).toBe("dev");
    expect(config.signozEndpoint).toBeUndefined();
  });

  test("reads PORT from env", () => {
    process.env.PORT = "8080";
    const config = loadConfig();
    expect(config.port).toBe(8080);
  });

  test("reads SIGNOZ_ENDPOINT from env", () => {
    process.env.SIGNOZ_ENDPOINT = "http://signoz:4318";
    const config = loadConfig();
    expect(config.signozEndpoint).toBe("http://signoz:4318");
  });

  test("throws on invalid PORT", () => {
    process.env.PORT = "99999";
    expect(() => loadConfig()).toThrow("Invalid PORT");
  });

  test("throws on non-numeric PORT", () => {
    process.env.PORT = "abc";
    expect(() => loadConfig()).toThrow("Invalid PORT");
  });
});
