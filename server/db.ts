import pg from "pg";

const { Pool } = pg;

function getConnectionString(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || "5432";
  const database = process.env.DB_NAME || "agroscan";
  const user = process.env.DB_USER || "agroscan_user";
  const password = process.env.DB_PASSWORD || "secure_password";

  return `postgresql://${user}:${password}@${host}:${port}/${database}`;
}

export const pool = new Pool({
  connectionString: getConnectionString(),
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params?: unknown[],
) {
  return pool.query<T>(text, params);
}

export async function checkDbConnection(): Promise<boolean> {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}
