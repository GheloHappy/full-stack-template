# API Guide

- Keep one domain in each `src/modules/<feature>/` folder.
- A normal domain contains a module, controller, service, and `dto/` directory.
- Validate all external input with `class-validator` DTOs and the global pipe.
- Inject `PrismaService`; do not construct Prisma clients inside feature code.
- Use exceptions from `src/common/errors` so clients receive a stable
  `{ statusCode, code, message }` body.
- Keep unauthenticated routes explicit once a global auth guard is enabled.
- Use `npm run db:migrate -- --name <change>` for schema changes and commit the
  generated migration.

Commands: `npm run dev`, `npm run build`, `npm run lint`, `npm run test`,
`npm run test:e2e`, `npm run db:generate`, and `npm run db:studio`.
