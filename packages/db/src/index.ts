import { sql } from "drizzle-orm";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export * from "./schema";
export { sql, eq, and, or, desc, asc, isNull, isNotNull } from "drizzle-orm";

export type Db = PostgresJsDatabase<typeof schema>;

export function databaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return url;
}

/** Create a client. Apps call this once per process; scripts pass `max: 1`. */
export function createDb(url = databaseUrl(), options: postgres.Options<Record<string, never>> = {}) {
  const client = postgres(url, { max: 10, prepare: false, ...options });
  return { db: drizzle(client, { schema }), client };
}

let cached: ReturnType<typeof createDb> | undefined;

/** Process-wide singleton for the Next.js apps. Reuses the pool across hot reloads in dev. */
export function getDb(): Db {
  const g = globalThis as unknown as { __tempestDb?: ReturnType<typeof createDb> };
  cached ??= g.__tempestDb ?? createDb();
  if (process.env.NODE_ENV !== "production") g.__tempestDb = cached;
  return cached.db;
}

/** Cheap liveness probe for /api/health. */
export async function pingDb(db: Db = getDb()): Promise<boolean> {
  const rows = await db.execute<{ ok: number }>(sql`select 1 as ok`);
  return rows.length === 1;
}
