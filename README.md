# Full Stack Template

A reusable TypeScript starter with three independently runnable applications:

- `api-nest/` — NestJS 11, Prisma 7, and PostgreSQL
- `mobile/` — Expo 57, React Native, Expo Router, NativeWind, React Query, Zustand, and SQLite
- `web/` — Vite 8, React 19, React Router, React Query, Zustand, axios, and Tailwind CSS 4

The dependency sets and folder conventions are based on the working reference
project, with product-specific finance code, branding, credentials, and generated
native/build output removed.

## Start a project

```bash
npm install
cp api-nest/.env.example api-nest/.env
cp web/.env.example web/.env
npm run db:generate
npm run dev
```

`npm run dev` starts the API and web client together. Start Expo separately when
needed:

```bash
npm run dev:mobile
```

PostgreSQL must be available at the URL in `api-nest/.env`. Create the first
migration after naming your project and defining its first real model:

```bash
npm run db:migrate -- --name init
```

## Before building a real app

1. Replace `full-stack-template`, `Full Stack Template`, `fullstacktemplate`, and
   `com.example.fullstacktemplate` in the manifests and Expo config.
2. Change every example secret and database value.
3. Replace the API `ExampleModule` and the sample web/mobile pages with real
   domains while keeping the documented boundaries.
4. Configure native identifiers and EAS project metadata before creating store
   builds.

See [BACKEND_STRUCTURE_GUIDE.md](BACKEND_STRUCTURE_GUIDE.md),
[EXPO_REACT_NATIVE_STRUCTURE_GUIDE.md](EXPO_REACT_NATIVE_STRUCTURE_GUIDE.md), and
[WEB_STRUCTURE_GUIDE.md](WEB_STRUCTURE_GUIDE.md) for where new code belongs.

## Root commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run API and web development servers |
| `npm run dev:api` | Run only NestJS in watch mode |
| `npm run dev:web` | Run only Vite |
| `npm run dev:mobile` | Start Expo |
| `npm run build` | Build API and web |
| `npm run lint` | Lint all three apps |
| `npm run test` | Run API and mobile tests |
| `npm run db:generate` | Generate the Prisma client |
| `npm run db:migrate` | Create/apply a development migration |

Each application can also be installed and run by itself.
