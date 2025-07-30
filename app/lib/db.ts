import mysql from 'mysql2/promise';

export async function query<T>({
  query,
  values = [],
}: {
  query: string;
  values?: any[];
}): Promise<T> {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  });

  try {
    const [results] = await connection.execute(query, values);
    void connection.end();
    return results as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw error;
  }
}