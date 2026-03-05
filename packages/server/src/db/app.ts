import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { engineTemplates } from "@proton/shared";
import { eq } from "drizzle-orm";

const defaultTemplates = [
  {
    name: "2D",
    description: "Classic 2D game engine with sprites, tilemaps and physics.",
    data: "{}",
  },
  {
    name: "3D",
    description: "3D engine with mesh rendering, lighting and PBR materials.",
    data: "{}",
  },
  {
    name: "Raymarching",
    description: "GPU-based raymarching engine for procedural 3D scenes.",
    data: "{}",
  },
  {
    name: "Raycasting",
    description: "Classic raycasting engine inspired by early FPS games.",
    data: "{}",
  },
];

export async function createAppDb(dbPath: string) {
  await mkdir(dirname(resolve(dbPath)), { recursive: true });

  const client = createClient({ url: `file:${resolve(dbPath)}` });
  const db = drizzle(client);

  await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      email TEXT,
      created_at INTEGER NOT NULL
    )
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS engine_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      data TEXT NOT NULL
    )
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      engine_template_id INTEGER NOT NULL,
      created_by INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    )
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS project_members (
      project_id TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      joined_at INTEGER NOT NULL
    )
  `);

  for (const template of defaultTemplates) {
    const existing = await db
      .select()
      .from(engineTemplates)
      .where(eq(engineTemplates.name, template.name));

    if (existing.length === 0) {
      await db.insert(engineTemplates).values(template);
    }
  }

  return db;
}

export type AppDb = Awaited<ReturnType<typeof createAppDb>>;
