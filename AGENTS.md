# Repository Guide

## Applications

- `api/` is the NestJS API. It owns validation, authorization, persistence,
  migrations, and the public HTTP contract. It can use PostgreSQL or SQL Server
  2008, selected once per deployment with `DB_PROVIDER`.
- `mobile/` is the Expo app. Keep routes thin and put reusable logic under
  `src/core` and `src/hooks`.
- `web/` is the Vite React app. Use React Query for server state and Zustand for
  small client-owned state.

## Shared rules

- Never commit `.env` files, secrets, generated native folders, build output, or
  dependencies.
- Keep API field names and error shapes consistent across both clients.
- Add a feature vertically: database model and API module first, then shared
  client types/services, then screens.
- Keep `src/database/migrations/postgresql.migrations.ts` and
  `mssql.migrations.ts` behaviorally equivalent. SQL Server migrations and
  queries must remain SQL Server 2008 compatible.
- Never infer a database provider from which credentials happen to be present.
  Read `DB_PROVIDER`; use `DATABASE_URL` only for PostgreSQL and the `DB_*`
  fields only for MSSQL.
- Use the local `AGENTS.md` and structure guide in each application before making
  structural changes.
- Run the affected application's build/type check and lint command before
  committing.
