# Backend Structure Guide

This template uses NestJS 11 with a deployment-selected database: Prisma 7 for
PostgreSQL or raw `mssql` for SQL Server 2008. It is organized around feature
modules so new domains can be added without turning the root module into
application logic.

## Layout

```text
api/
  prisma/
    schema.prisma
  src/
    main.ts
    app.module.ts
    common/
      constants/
      decorators/
      errors/
      filters/
      guards/
      pagination/
      types/
    modules/
      example/
        dto/
        example.controller.ts
        example.module.ts
        example.service.ts
    database/
      database.module.ts
      database.service.ts
      database.types.ts
      mssql.config.ts
      migrate.ts
      migrations/
        postgresql.migrations.ts
        mssql.migrations.ts
  .env.example
  prisma.config.ts
  nest-cli.json
  tsconfig.json
```

`main.ts` owns process-wide behavior: the `/api/v1` prefix, CORS, cookies,
validation, exception normalization, and startup. `app.module.ts` only composes
infrastructure and feature modules.

## Adding a feature

Create one folder under `src/modules/<feature>`:

```text
<feature>/
  dto/
    create-<feature>.dto.ts
    update-<feature>.dto.ts
  <feature>.controller.ts
  <feature>.service.ts
  <feature>.module.ts
```

The controller translates HTTP input to service calls. The service owns domain
rules and database work. DTOs define accepted external input. Register only the
module in `app.module.ts`.

Use the global `ValidationPipe` settings already in `main.ts`. Unknown fields are
rejected and supported values are transformed according to DTO metadata. Avoid
manual request-body casting in controllers.

## Database selection

Every environment must explicitly set one provider:

```env
DB_PROVIDER=postgresql
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
```

or:

```env
DB_PROVIDER=mssql
DB_HOST=sql-host
DB_PORT=1433
DB_USER=app_user
DB_PASSWORD=change-me
DB_NAME=app
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
```

`DatabaseService` opens only the selected connection. Inject it into feature
services. PostgreSQL branches use `database.postgres`; MSSQL branches use
`database.mssql` and parameterized requests. Keep provider branching in the
persistence portion of a service or in a feature repository—not in controllers.

Define PostgreSQL models in `prisma/schema.prisma`. Regenerate the typed client
after model changes:

```bash
npm run db:generate
npm run db:studio
```

Use explicit `@map` and `@@map` attributes if the database uses snake_case while
TypeScript uses camelCase. `db:studio` is PostgreSQL-only.

## Migrations

Migrations are ordered TypeScript entries rather than provider-generated files:

- `postgresql.migrations.ts` contains PostgreSQL SQL.
- `mssql.migrations.ts` contains SQL Server 2008-compatible SQL.
- Both lists use the same unique id for the same logical schema change.
- `npm run db:migrate` reads `DB_PROVIDER`, runs pending entries in transactions,
  and records them in the app-owned `app_migrations` table.

For each schema change, update the Prisma schema and both migration lists. Never
edit an already-deployed migration; append a new one. Test the migration against
both database engines when the feature claims dual-provider support.

SQL Server 2008 has important limitations. Use `ROW_NUMBER()` rather than
`OFFSET/FETCH`; do not use `CREATE OR ALTER`, `DROP ... IF EXISTS`, JSON SQL
functions, `STRING_AGG`, or newer-only types. Prefer `DATETIME2`,
`UNIQUEIDENTIFIER`, `NVARCHAR`, and explicit `IF OBJECT_ID(...)` guards.

## Authentication pattern

The installed packages support the reference architecture:

- short-lived access JWTs and rotating refresh sessions
- httpOnly cookies for browsers
- bearer tokens stored in SecureStore for mobile
- a global JWT guard with explicit `@Public()` opt-outs
- bcrypt password hashes and persisted refresh-token hashes
- Google ID-token verification
- throttled login/reset endpoints

When auth is added, register the guard through `APP_GUARD`. This makes new routes
protected automatically. Public registration, login, refresh, health, and reset
routes must use `@Public()`.

For dual clients, inspect `X-Client-Type`. Web responses should set secure,
httpOnly cookies; mobile responses should return tokens for SecureStore. Never put
browser JWTs in local storage.

## Errors

Throw typed `AppException` instances for expected failures. The global filter
normalizes errors to:

```json
{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "Invalid request"
}
```

Add stable machine-readable members to `ErrorCode`. Clients should branch on the
code and use the message as display text.

## Realtime and offline sync

If a mobile domain must work offline, use client-generated UUIDs, soft deletes,
and incremental pull/push endpoints. A WebSocket event should carry only an
invalidation hint; clients still reconcile through the normal REST endpoint.

Do not implement synchronization as full-table replacement. Track a server
watermark and explicit local pending state where pulled rows could otherwise be
mistaken for new local writes.

## Production checks

- Require long, independent JWT secrets.
- List explicit CORS origins when credentials are enabled.
- Keep provider keys and database credentials in environment configuration.
- Add a public health endpoint that verifies database connectivity.
- Run `npm run db:migrate` as a deliberate deployment step.
- Build with `npm run build` and start with `npm run prod`.
