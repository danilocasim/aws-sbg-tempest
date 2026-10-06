// Applies pending migrations from ./migrations. Runs as the Coolify pre-deploy command
// (bundled to dist/migrate.mjs by `pnpm build`) and locally via `pnpm db:migrate`.
// Never run at container start of both apps: two concurrent migrators race.
import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const migrationsFolder =
  process.env.MIGRATIONS_DIR ?? path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "migrations");

const client = postgres(url, { max: 1, onnotice: () => {} });
const db = drizzle(client);
const started = Date.now();
try {
  await migrate(db, { migrationsFolder });
  console.log(`migrations applied from ${migrationsFolder} in ${Date.now() - started} ms`);
} finally {
  await client.end();
}
