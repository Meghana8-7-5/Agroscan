/**
 * Root database runner / export module for AgroScan
 * Runs DB migration & seeding when executed directly: `node database.js`
 * Or provides database connection when imported.
 */
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER || "agroscan_user"}:${process.env.DB_PASSWORD || "secure_password"}@${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || "5432"}/${process.env.DB_NAME || "agroscan"}`;

const isRemoteDb =
  Boolean(connectionString) &&
  !connectionString.includes("localhost") &&
  !connectionString.includes("127.0.0.1");

const useSsl = process.env.DB_SSL === "true" || (isRemoteDb && process.env.DB_SSL !== "false");

export const pool = new pg.Pool({
  connectionString,
  ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

pool.on("error", (err) => {
  console.warn("[DATABASE POOL WARNING] Idle client error or connection reset:", err.message || err);
});

export async function query(text, params) {
  try {
    return await pool.query(text, params);
  } catch (err) {
    console.warn(`[DATABASE QUERY WARNING] ${err.message || err}`);
    throw err;
  }
}

export async function checkDbConnection() {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch (err) {
    console.warn(`[DB HEALTH] Database currently unreachable (${err.message || err}).`);
    return false;
  }
}

export default pool;

// If executed directly with `node database.js`, run setup script
const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith("database.js") ||
  process.argv[1].endsWith("database.mjs") ||
  process.argv[1].endsWith("database")
);

if (isDirectRun) {
  import("./scripts/setup-db.mjs").catch((err) => {
    console.error("Database execution error:", err);
  });
}
