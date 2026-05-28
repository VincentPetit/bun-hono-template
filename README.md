# bun-hono-template

A production-ready starting point for Bun + Hono services with:

- **Hono** — fast, lightweight HTTP framework
- **Drizzle ORM** — type-safe SQLite with schema-push workflow
- **OpenTelemetry** — traces, metrics, and logs via OTLP (disabled if `SIGNOZ_ENDPOINT` is unset)
- **Biome** — lint + format
- **Docker** — `oven/bun:1-alpine`, layer-cached, `APP_VERSION` baked in
- **GitHub Actions** — test → build (GHCR) → staging → production, with rollback

## Getting started

```bash
cp .env.example .env
bun install
bun run dev        # http://localhost:3000
```

## What to replace after cloning

- [ ] Rename `name` in `package.json`
- [ ] Add your routes to `src/index.ts`
- [ ] Add project-specific env vars to `src/lib/config.ts` and `.env.example`
- [ ] Define your Drizzle schema in `src/db/schema.ts`, then run `bun run db:push`
- [ ] In GitHub repo Settings → Environments, create `staging` and `production` environments
- [ ] Set `DEPLOY_WEBHOOK_URL` secret in each environment (your deploy trigger URL)
- [ ] Set `GATEWAY_URL` variable in each environment (your service's public URL — used for health-check verification after deploy)
- [ ] Set `SIGNOZ_ENDPOINT` environment variable if using OpenTelemetry (otherwise delete `src/instrumentation.ts` and remove OTel deps from `package.json`)

## Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Watch mode dev server |
| `bun run start` | Production run |
| `bun test` | Run all tests |
| `bun run lint` | Lint + format check |
| `bun run lint:fix` | Auto-fix lint + format |
| `bun run db:push` | Push Drizzle schema to SQLite |

## `/health` contract

`GET /health` returns `{ ok: true, version: "<APP_VERSION>" }`.

The CI pipeline's deployment verification polls this endpoint after each deploy and checks that `version` matches `github.sha`. Set `APP_VERSION` to `github.sha` in your runtime environment (the Dockerfile `ARG` handles this automatically when built via CI).
