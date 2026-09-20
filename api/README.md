# API

NestJS 11 REST API with runtime-selectable PostgreSQL/Prisma or SQL Server 2008.
Routes use the `/api/v1` prefix. The starter includes validation, CORS, a
normalized exception filter, provider-aware lifecycle wiring and migrations,
and one example module that runs on either provider.

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run dev
```

Set `DB_PROVIDER=postgresql` with `DATABASE_URL`, or set `DB_PROVIDER=mssql`
with `DB_HOST`, `DB_PORT`/`DB_INSTANCE`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`.
Only the selected connection is opened. The current schema intentionally
contains one `Example` model/table so the sample CRUD endpoint works with both.

The custom migration runner tracks ids in `app_migrations`. Add equivalent SQL
to both files in `src/database/migrations/` for each change. Prisma Studio and
Prisma Client generation apply only to PostgreSQL; SQL Server uses parameterized
raw `mssql` queries for compatibility with SQL Server 2008.

See [`../BACKEND_STRUCTURE_GUIDE.md`](../BACKEND_STRUCTURE_GUIDE.md) for the
architecture and [`AGENTS.md`](AGENTS.md) for local conventions.

This project is installed and deployed independently. Configure an API Jenkins
job with `api/Jenkinsfile`; it does not build or restart the web application.
