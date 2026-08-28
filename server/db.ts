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

pool.on("error", (err) => {
  console.warn("[DATABASE POOL WARNING] Idle client error or connection reset:", err.message || err);
});

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params?: unknown[],
) {
  try {
    return await pool.query<T>(text, params);
  } catch (err: any) {
    console.warn(`[DATABASE QUERY WARNING] ${err.message || err}`);
    throw err;
  }
}

export async function checkDbConnection(): Promise<boolean> {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch (err: any) {
    console.warn(`[DB HEALTH] Database currently unreachable (${err.message || err}). Running with fallback stores.`);
    return false;
  }
}

export default pool;

