import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import sql from 'mssql';
import { getDatabaseProvider } from './database.types';
import { createMssqlConfig } from './mssql.config';
import { MSSQL_MIGRATIONS } from './migrations/mssql.migrations';
import { POSTGRESQL_MIGRATIONS } from './migrations/postgresql.migrations';

async function migratePostgresql(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) throw new Error('DATABASE_URL is required');

  const prisma = new PrismaClient({ adapter: new PrismaPg(databaseUrl) });
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS app_migrations (
        id VARCHAR(100) PRIMARY KEY,
        applied_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const applied = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
      'SELECT id FROM app_migrations',
    );
    const appliedIds = new Set(applied.map(({ id }) => id));

    for (const migration of POSTGRESQL_MIGRATIONS) {
      if (appliedIds.has(migration.id)) continue;
      await prisma.$transaction(async (transaction) => {
        await transaction.$executeRawUnsafe(migration.sql);
        await transaction.$executeRawUnsafe(
          'INSERT INTO app_migrations (id) VALUES ($1)',
          migration.id,
        );
      });
      console.log(`Applied PostgreSQL migration ${migration.id}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

async function migrateMssql(): Promise<void> {
  const pool = await new sql.ConnectionPool(createMssqlConfig()).connect();
  try {
    await pool.request().query(`
      IF OBJECT_ID(N'dbo.app_migrations', N'U') IS NULL
      BEGIN
        CREATE TABLE dbo.app_migrations (
          id VARCHAR(100) NOT NULL CONSTRAINT PK_app_migrations PRIMARY KEY,
          applied_at DATETIME2 NOT NULL CONSTRAINT DF_app_migrations_applied_at DEFAULT GETUTCDATE()
        );
      END
    `);

    const result = await pool
      .request()
      .query<{ id: string }>('SELECT id FROM dbo.app_migrations');
    const appliedIds = new Set(result.recordset.map(({ id }) => id));

    for (const migration of MSSQL_MIGRATIONS) {
      if (appliedIds.has(migration.id)) continue;
      const transaction = new sql.Transaction(pool);
      await transaction.begin();
      try {
        await new sql.Request(transaction).query(migration.sql);
        await new sql.Request(transaction)
          .input('id', sql.VarChar(100), migration.id)
          .query('INSERT INTO dbo.app_migrations (id) VALUES (@id)');
        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
      console.log(`Applied MSSQL migration ${migration.id}`);
    }
  } finally {
    await pool.close();
  }
}

async function migrate(): Promise<void> {
  const provider = getDatabaseProvider();
  console.log(`Running ${provider} migrations`);
  await (provider === 'postgresql' ? migratePostgresql() : migrateMssql());
  console.log('Migration complete');
}

void migrate().catch((error: unknown) => {
  console.error('Migration failed:', error);
  process.exitCode = 1;
});
