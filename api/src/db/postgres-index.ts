import { Pool } from 'pg';
import { DB_USER, DB_PASSWORD, DB_NAME } from 'src/config/constants';

const pool = new Pool({
  user: DB_USER,
  host: Bun.env.DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: parseInt(Bun.env.DB_PORT || '5432'),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const executeQuery = async (text: string, params?: any[]) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export const getClient = async () => {
  const client = await pool.connect();
  return client;
};