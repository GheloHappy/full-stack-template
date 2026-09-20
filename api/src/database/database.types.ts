export const DATABASE_PROVIDERS = ['postgresql', 'mssql'] as const;

export type DatabaseProvider = (typeof DATABASE_PROVIDERS)[number];

export function getDatabaseProvider(): DatabaseProvider {
  const provider = process.env.DB_PROVIDER?.trim().toLowerCase();

  if (!provider) {
    throw new Error('DB_PROVIDER is required. Use postgresql or mssql.');
  }

  if (provider === 'postgres' || provider === 'postgresql') {
    return 'postgresql';
  }

  if (provider === 'mssql' || provider === 'sqlserver') {
    return 'mssql';
  }

  throw new Error(
    `Unsupported DB_PROVIDER "${process.env.DB_PROVIDER}". Use postgresql or mssql.`,
  );
}
