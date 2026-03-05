import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { resolve } from "node:path";

export async function createProjectDb(projectDir: string) {
  const dbPath = resolve(projectDir, "project.db");
  const client = createClient({ url: `file:${dbPath}` });
  const db = drizzle(client);

  await db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS user_settings (
      user_id INTEGER NOT NULL,
      key TEXT NOT NULL,
      value TEXT NOT NULL,
      PRIMARY KEY (user_id, key)
    )
  `);

  return db;
}

export type ProjectDb = Awaited<ReturnType<typeof createProjectDb>>;
