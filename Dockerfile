## Builder stage
FROM oven/bun:1.3.5 AS builder
WORKDIR /app

COPY vite.config.ts tsconfig.json package.json bun.lock tailwind.config.js index.html ./
COPY src ./src
COPY public ./public
RUN bun install --frozen-lockfile
RUN bun run build
RUN ls dist

## Production stage
FROM oven/bun:1.3.5-alpine
WORKDIR /app

RUN apk --no-cache add curl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/dist ./dist
COPY server.ts server.ts


EXPOSE 3000
ENV NODE_ENV production
CMD ["bun", "--bun", "server.ts"] 