import type { SqlMigration } from './postgresql.migrations';

export const MSSQL_MIGRATIONS: SqlMigration[] = [
  {
    id: '202609210001_create_examples',
    sql: `
      IF OBJECT_ID(N'dbo.examples', N'U') IS NULL
      BEGIN
        CREATE TABLE dbo.examples (
          id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_examples PRIMARY KEY,
          name NVARCHAR(120) NOT NULL,
          created_at DATETIME2 NOT NULL CONSTRAINT DF_examples_created_at DEFAULT GETUTCDATE(),
          updated_at DATETIME2 NOT NULL CONSTRAINT DF_examples_updated_at DEFAULT GETUTCDATE()
        );
      END
    `,
  },
];
