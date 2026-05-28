FROM oven/bun:1-alpine

WORKDIR /app

# Install dependencies (cached layer — only rebuilt when package.json or lockfile changes)
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --production

# Copy application source
COPY src/ src/

# Create data directory for SQLite
RUN mkdir -p /app/data

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:${PORT:-3000}/health || exit 1

# Bake commit SHA into image — exposed via GET /health as { version }
ARG APP_VERSION=dev
ENV APP_VERSION=$APP_VERSION

CMD ["bun", "run", "src/index.ts"]
