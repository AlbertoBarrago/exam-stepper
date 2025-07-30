import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || '5432', 10),
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
});

export async function query<T>({
  query,
  values = [],
}: {
  query: string;
  values?: any[];
}): Promise<T> {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(query, values);
    return rows as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw error;
  } finally {
    client.release();
  }
}
