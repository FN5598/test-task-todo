FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY backend/package.json ./backend/package.json

RUN pnpm install --frozen-lockfile --filter @repo/backend...

COPY backend ./backend

RUN pnpm --filter @repo/backend build

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["node", "backend/dist/server.js"]
