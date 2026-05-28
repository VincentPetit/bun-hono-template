export interface AppConfig {
  port: number;
  databasePath: string;
  signozEndpoint: string | undefined;
  applicationName: string;
  environment: string;
  appVersion: string;
  nodeEnv: string;
}

export function loadConfig(): AppConfig {
  const port = parseInt(process.env.PORT ?? "3000", 10);

  if (Number.isNaN(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT: ${process.env.PORT} (must be 1–65535)`);
  }

  return Object.freeze({
    port,
    databasePath: process.env.DATABASE_PATH ?? "./data/app.db",
    signozEndpoint: process.env.SIGNOZ_ENDPOINT || undefined,
    applicationName: process.env.APPLICATION_NAME ?? "bun-hono-service",
    environment: process.env.ENVIRONMENT ?? "production",
    appVersion: process.env.APP_VERSION ?? "dev",
    nodeEnv: process.env.NODE_ENV ?? "development",
  });
}
