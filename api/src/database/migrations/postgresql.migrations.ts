export interface SqlMigration {
  id: string;
  sql: string;
}

export const POSTGRESQL_MIGRATIONS: SqlMigration[] = [
  {
    id: '202609210001_create_examples',
    sql: `
      CREATE TABLE IF NOT EXISTS examples (
        id UUID PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `,
  },
];
