import mysql from 'mysql2/promise';

export async function query({ query, values = [] }: { query: string; values?: never[] }) {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  });

  try {
    const [results] = await connection.execute(query, values);
    void connection.end();
    return results;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
}
