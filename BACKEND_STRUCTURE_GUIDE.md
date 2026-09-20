# Backend Structure Guide

This template uses NestJS 11, Prisma 7, and PostgreSQL. It is organized around
feature modules so new domains can be added without turning the root module into
application logic.

## Layout

```text
api-nest/
  prisma/
    schema.prisma
    migrations/
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
    prisma/
      prisma.module.ts
      prisma.service.ts
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

## Prisma

Define models in `prisma/schema.prisma` and inject `PrismaService` into services.
Never construct a Prisma client in a feature module.

```bash
npm run db:generate
npm run db:migrate -- --name add_projects
npm run db:studio
```

Use explicit `@map` and `@@map` attributes if the database uses snake_case while
TypeScript uses camelCase. Commit schema changes and their generated migrations
together.

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
- Run migrations as a deliberate deployment step.
- Build with `npm run build` and start with `npm run prod`.
