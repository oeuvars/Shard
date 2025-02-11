FROM oven/bun:latest AS deps

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

FROM oven/bun:latest AS builder

WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN bun run build

FROM oven/bun:latest AS runner

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

COPY ./start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["/usr/local/bin/start.sh"]
