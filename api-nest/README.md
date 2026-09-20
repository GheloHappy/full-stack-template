# API

NestJS 11 REST API with Prisma 7 and PostgreSQL. Routes use the `/api/v1`
prefix. The starter includes validation, CORS, a normalized exception filter,
Prisma lifecycle wiring, and one example module.

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate -- --name init
npm run dev
```

The current schema intentionally contains one `Example` model so Prisma can be
generated and the sample CRUD endpoint can run immediately. Replace it when the
first domain is known.

See [`../BACKEND_STRUCTURE_GUIDE.md`](../BACKEND_STRUCTURE_GUIDE.md) for the
architecture and [`AGENTS.md`](AGENTS.md) for local conventions.
