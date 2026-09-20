import type { config as SqlConfig } from 'mssql';

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required when DB_PROVIDER=mssql`);
  }
  return value;
}

function booleanValue(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === '') return fallback;
  return value.toLowerCase() === 'true';
}

export function createMssqlConfig(): SqlConfig {
  const instanceName = process.env.DB_INSTANCE?.trim();
  const port = Number(process.env.DB_PORT ?? 1433);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('DB_PORT must be a valid TCP port');
  }

  return {
    server: required('DB_HOST'),
    ...(instanceName ? {} : { port }),
    user: required('DB_USER'),
    password: required('DB_PASSWORD'),
    database: required('DB_NAME'),
    connectionTimeout: Number(process.env.DB_CONNECTION_TIMEOUT_MS ?? 15_000),
    requestTimeout: Number(process.env.DB_REQUEST_TIMEOUT_MS ?? 30_000),
    pool: {
      min: Number(process.env.DB_POOL_MIN ?? 0),
      max: Number(process.env.DB_POOL_MAX ?? 10),
      idleTimeoutMillis: Number(process.env.DB_POOL_IDLE_MS ?? 30_000),
    },
    options: {
      ...(instanceName ? { instanceName } : {}),
      // SQL Server 2008 commonly has no modern TLS certificate configured.
      // Override these flags when the target server supports encrypted traffic.
      encrypt: booleanValue(process.env.DB_ENCRYPT, false),
      trustServerCertificate: booleanValue(
        process.env.DB_TRUST_SERVER_CERTIFICATE,
        true,
      ),
      enableArithAbort: true,
      useUTC: true,
      tdsVersion: '7_3_A',
    },
  };
}
