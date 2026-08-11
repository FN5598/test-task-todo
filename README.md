# Express + Next.js monorepo

This pnpm workspace clearly separates an Express API (`backend/`) from a Next.js App Router frontend (`client/`).

## Prerequisites

- Node.js 20.9 or newer
- pnpm 10 or newer (`corepack enable` enables the version declared by the repo)

## Start development

```bash
corepack enable
pnpm install
pnpm dev
```

- Web app: http://localhost:3000
- API health check: http://localhost:4000/health

Set `NEXT_PUBLIC_API_URL` in `client/.env.local` to change the API URL used by the frontend. It defaults to `http://localhost:4000`.

## Commands

```bash
pnpm dev        # run both apps
pnpm build      # build both apps
pnpm typecheck  # type-check all workspace packages
pnpm test       # run all tests
```

## Structure

```text
backend/        Express API
client/         Next.js frontend
packages/       Shared packages (reserved for future use)
```
