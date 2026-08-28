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

const connectionString = getConnectionString();
const isRemoteDb =
  Boolean(connectionString) &&
  !connectionString.includes("localhost") &&
  !connectionString.includes("127.0.0.1");

const useSsl = process.env.DB_SSL === "true" || (isRemoteDb && process.env.DB_SSL !== "false");

export const pool = new Pool({
  connectionString,
  ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
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

export default pool;

