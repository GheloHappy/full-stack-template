# API Guide

- Keep one domain in each `src/modules/<feature>/` folder.
- A normal domain contains a module, controller, service, and `dto/` directory.
- Validate all external input with `class-validator` DTOs and the global pipe.
- Inject `DatabaseService`; never construct Prisma clients or MSSQL pools inside
  feature code. Branch on `database.provider`, use `database.postgres` for
  Prisma and parameterized `database.mssql` requests for SQL Server.
- Use exceptions from `src/common/errors` so clients receive a stable
  `{ statusCode, code, message }` body.
- Keep unauthenticated routes explicit once a global auth guard is enabled.
- Set `DB_PROVIDER=postgresql` or `DB_PROVIDER=mssql` explicitly in every env.
- Add every schema change to both provider migration lists under
  `src/database/migrations/`, using the same migration id and equivalent schema.
  Run `npm run db:migrate`; the runner records applied ids in `app_migrations`.
- SQL Server code must work on SQL Server 2008: use `ROW_NUMBER()` for paging,
  avoid `OFFSET/FETCH`, `CREATE OR ALTER`, JSON functions, and newer-only types,
  and keep all inputs parameterized.
- Prisma models describe the PostgreSQL schema and provide its typed client.
  MSSQL row types and queries live beside the consuming repository/service.

Commands: `npm run dev`, `npm run build`, `npm run lint`, `npm run test`,
`npm run test:e2e`, `npm run db:generate`, `npm run db:migrate`, and PostgreSQL-
only `npm run db:studio`.
