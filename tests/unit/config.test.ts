import { afterEach, describe, expect, test } from "bun:test";
import { loadConfig } from "../../src/lib/config";

const saved = { ...process.env };

afterEach(() => {
  // Restore env after each test
  for (const key of ["PORT", "DATABASE_PATH", "SIGNOZ_ENDPOINT", "APP_VERSION", "NODE_ENV"]) {
    if (key in saved) process.env[key] = saved[key];
    else delete process.env[key];
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
});
