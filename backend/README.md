# Todo backend

Express, Sequelize, and PostgreSQL API for the Todo app. The API runs on port `4000` and is mounted under `/api`.

## Run with Docker

From the repository root, set `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` in `.env`, then run:

```bash
pnpm docker:start
pnpm docker:logs
```

Stop the containers with `pnpm docker:stop`. To remove the database volume too, use `pnpm docker:erase`.

## Run locally

PostgreSQL must be available first. Set the variables in [`.env.example`](.env.example), plus these required secrets, in your shell or process environment:

```bash
JWT_ACCESS_SECRET=replace-with-a-long-random-secret
JWT_REFRESH_SECRET=replace-with-a-different-long-random-secret
```

Then start the API from the repository root:

```bash
pnpm --filter @repo/backend dev
```

Useful checks:

```bash
pnpm --filter @repo/backend typecheck
pnpm --filter @repo/backend build
```

## API

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Health check |
| `POST` | `/api/auth/sign-in` | Register a user |
| `POST` | `/api/auth/log-in` | Log in |
| `POST` | `/api/auth/refresh-token` | Rotate the current refresh token |
| `POST` | `/api/auth/sign-out` | End the current session |
| `GET` | `/api/tasks?page=1&limit=20&status=active` | List the current user’s tasks |
| `GET` | `/api/tasks/counts` | Get active/done/total counts |
| `POST` | `/api/tasks` | Create a task |
| `GET` | `/api/tasks/slug/:slug` | Get a task by slug |
| `PATCH` | `/api/tasks/:taskId` | Update a task |
| `DELETE` | `/api/tasks/:taskId` | Delete a task |

Task endpoints require the HttpOnly `access_token` cookie. The server derives task ownership from that cookie; clients must not send `userId`. Valid task statuses are `todo`, `in_progress`, and `done`; `active` is also available as a list filter.

## Structure

```text
src/
  config/       # database, JWT, and cookie configuration
  errors/       # application error types
  middlewares/  # authentication and error handling
  routes/       # Express route registration
  shared/       # logging, validation helpers, model registration
  users/        # auth/users feature
  tasks/        # task feature
```

Feature code uses direct aliases such as `@users/*`, `@tasks/*`, and `@shared/*`. The build rewrites these aliases before Node starts the compiled application.

## Logging

Docker enables readable logs by default. Set `LOG_PRETTY=false` for JSON logs, or set `LOG_LEVEL` to control verbosity.
