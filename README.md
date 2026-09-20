# Full Stack Template

A reusable TypeScript starter with three independently runnable applications:

- `api/` — NestJS 11 with selectable PostgreSQL/Prisma or SQL Server 2008
- `mobile/` — Expo 57, React Native, Expo Router, NativeWind, React Query, Zustand, and SQLite
- `web/` — Vite 8, React 19, React Router, React Query, Zustand, axios, and Tailwind CSS 4

The three folders are intentionally independent projects. Each has its own
manifest, lockfile, dependency installation, version, build, and deployment.
There is no root npm workspace or shared root dependency graph.

The dependency sets and folder conventions are based on the working reference
project, with product-specific finance code, branding, credentials, and generated
native/build output removed.

## Start a project

Install and start each project from its own directory:

```bash
cd api
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run dev
```

```bash
cd web
npm install
cp .env.example .env
npm run dev
```

```bash
cd mobile
npm install
cp .env.example .env
npm start
```

Choose exactly one backend connection in `api/.env`:

```env
# PostgreSQL
DB_PROVIDER=postgresql
DATABASE_URL=postgresql://postgres:password@localhost:5432/app?schema=public

# Or SQL Server 2008
DB_PROVIDER=mssql
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=password
DB_NAME=app
```

From `api/`, `npm run db:migrate` detects the selected provider and applies only that
provider's pending migrations. The two committed migration lists are kept in
parity so the application contract is the same on either database.

## Before building a real app

1. Replace `full-stack-template`, `Full Stack Template`, `fullstacktemplate`, and
   `com.example.fullstacktemplate` in the manifests and Expo config.
2. Change every example secret and database value.
3. Replace the API `ExampleModule` and the sample web/mobile pages with real
   domains while keeping the documented boundaries.
4. Configure native identifiers and EAS project metadata before creating store
   builds.
5. Replace the example Jenkins targets, env directories, ports, and
   `DEPLOY_NAMESPACE` before the first deployment.

See [BACKEND_STRUCTURE_GUIDE.md](BACKEND_STRUCTURE_GUIDE.md),
[EXPO_REACT_NATIVE_STRUCTURE_GUIDE.md](EXPO_REACT_NATIVE_STRUCTURE_GUIDE.md), and
[WEB_STRUCTURE_GUIDE.md](WEB_STRUCTURE_GUIDE.md) for where new code belongs.
See [DEPLOYMENT.md](DEPLOYMENT.md) for Docker and multi-target Jenkins setup.

## Project commands

Run commands inside the project they affect. API database commands belong in
`api/`; Vite commands belong in `web/`; Expo/EAS commands belong in `mobile/`.
This keeps CI caches, dependency updates, versioning, and deployments isolated.
