import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Client generation does not connect. A harmless fallback keeps Docker and
    // CI builds independent from deployment secrets; runtime validates the URL.
    url:
      process.env.DATABASE_URL ??
      'postgresql://postgres:password@localhost:5432/app?schema=public',
  },
});
