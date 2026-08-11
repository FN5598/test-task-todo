# Todo App

A pnpm workspace containing a Next.js client and an Express/PostgreSQL API.

For implementation details, see the [backend README](backend/README.md) and [client README](client/README.md).

## Prerequisites

- Node.js `20.9` or newer
- pnpm `10` or newer
- Docker with Docker Compose (recommended for the API and PostgreSQL)

Enable pnpm through Corepack if needed:

```bash
corepack enable
```

## Quick start

Install dependencies and create the Docker environment file:

```bash
pnpm install
cp .env.example .env
```

Set different long random values for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` in `.env`, then start the API and database:

```bash
pnpm docker:start
pnpm docker:logs
```

The Docker services expose:

- API: `http://localhost:4000`
- PostgreSQL: `localhost:5432`

Start the frontend in a second terminal:

```bash
pnpm --filter @repo/client dev
```

It is available at `http://localhost:3000`.

## Common commands

```bash
pnpm typecheck       # Type-check every workspace package
pnpm build           # Build backend and frontend
pnpm docker:stop     # Stop containers, preserving PostgreSQL data
pnpm docker:erase    # Stop containers and remove PostgreSQL data
```

`pnpm docker:erase` is destructive: it removes the local Postgres volume.

## Fully local development

`pnpm dev` runs both applications outside Docker. You will need a locally running PostgreSQL instance and the backend environment variables described in the [backend README](backend/README.md).
