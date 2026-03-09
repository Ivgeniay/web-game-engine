import fsp from "fs/promises";
import path from "path";
import { metaService } from "../services/MetaService.js";

async function ensureMetaForDir(
  projectId: string,
  dirAbsPath: string,
  assetsRoot: string,
): Promise<void> {
  const entries = await fsp.readdir(dirAbsPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.endsWith(".meta")) continue;

    const absPath = path.join(dirAbsPath, entry.name);
    const relativePath = path.relative(assetsRoot, absPath);

    try {
      await metaService.create(projectId, relativePath);
    } catch (err: any) {
      if (err?.code !== "EEXIST") {
        console.warn(
          `[scanAndEnsureMeta] skipped ${relativePath}: ${err?.message}`,
        );
      }
    }

    if (entry.isDirectory()) {
      await ensureMetaForDir(projectId, absPath, assetsRoot);
    }
  }
}

export async function scanAndEnsureMeta(projectsPath: string): Promise<void> {
  let projects: string[];

  try {
    const entries = await fsp.readdir(projectsPath, { withFileTypes: true });
    projects = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return;
  }

  for (const projectId of projects) {
    const assetsRoot = path.join(projectsPath, projectId, "Assets");

    try {
      await fsp.access(assetsRoot);
    } catch {
      continue;
    }

    await ensureMetaForDir(projectId, assetsRoot, assetsRoot);
  }
}
