FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

WORKDIR /app
COPY apps/web/package.json apps/web/pnpm-lock.yaml* ./apps/web/
RUN cd apps/web && pnpm install --frozen-lockfile || pnpm install

COPY apps/web /app/apps/web

CMD ["pnpm", "dev", "--", "-H", "0.0.0.0"]
