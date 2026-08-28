import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(root, ".env") });

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER || "agroscan_user"}:${process.env.DB_PASSWORD || "secure_password"}@${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || "5432"}/${process.env.DB_NAME || "agroscan"}`;

async function runSqlFile(client, relativePath) {
  const filePath = path.join(root, relativePath);
  const sql = fs.readFileSync(filePath, "utf8");
  await client.query(sql);
  console.log(`Applied ${relativePath}`);
}

async function hashSeedPasswords(client) {
  const demoPassword = process.env.SEED_DEMO_PASSWORD || "AgroScan@2026";
  const hash = await bcrypt.hash(demoPassword, 12);
  const result = await client.query(
    "UPDATE users SET password_hash = $1 WHERE password_hash LIKE '$2b$12$eX4mP1%'",
    [hash],
  );
  console.log(`Updated ${result.rowCount} seed user passwords`);
}

async function main() {
  const client = new pg.Client({ connectionString });

  try {
    console.log("Connecting to PostgreSQL...");
    await client.connect();
    console.log("Connected.");

    await runSqlFile(client, "database/schema.sql");
    await runSqlFile(client, "database/seed.sql");
    await hashSeedPasswords(client);

    const tables = await client.query(
      "SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = 'public'",
    );
    const users = await client.query("SELECT COUNT(*) AS count FROM users");

    console.log("\nDatabase setup complete.");
    console.log(`Tables: ${tables.rows[0].count}`);
    console.log(`Users: ${users.rows[0].count}`);
    console.log("\nDemo login: +919876543210 / AgroScan@2026");
  } catch (error) {
    console.error("Database setup failed:", error.message || error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
