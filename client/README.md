# Todo frontend

Next.js App Router client for the Todo app. It talks to the backend API through Server Actions and server-side request helpers, keeping authentication cookies HttpOnly.

## Run

Set `API_URL` and `NEXT_PUBLIC_API_URL` as shown in [`.env.example`](.env.example), then run from the repository root:

```bash
pnpm --filter @repo/client dev
pnpm --filter @repo/client typecheck
pnpm --filter @repo/client build
```

## Paths

| Path | Purpose |
| --- | --- |
| `/auth?tab=signin` | Registration form |
| `/auth?tab=login` | Login form |
| `/tasks` | Paginated task list and filters |
| `/tasks/new` | Create a task |
| `/tasks/:slug` | Task detail |
| `/tasks/:slug/edit` | Edit a task |
| `/api/auth/refresh` | Internal refresh-token proxy route |

## Structure

```text
app/        # routes, layouts, Server Actions, error boundaries
UI/header/  # header and theme controls
UI/forms/   # auth and task forms
UI/         # shared task and feedback components
lib/        # validation, styling, and formatting helpers
proxy.ts    # route fallback handling
```

Imports use `@app/*`, `@ui/*`, and `@lib/*` aliases. Route files must remain named `page.tsx`, but their exported components use semantic names.
