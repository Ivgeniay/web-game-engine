import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { randomUUID } from "crypto";
import { getMetaType, type AnyMeta, type MetaType } from "@proton/shared";

let projectsRoot: string | null = null;

function getProjectsRoot(): string {
  if (!projectsRoot) throw new Error("MetaService not initialized");
  return projectsRoot;
}

function assetsRoot(projectId: string): string {
  return path.join(getProjectsRoot(), projectId, "Assets");
}

function resolveAssetPath(projectId: string, relativePath: string): string {
  const root = assetsRoot(projectId);
  const resolved = path.resolve(root, relativePath);
  if (!resolved.startsWith(root)) {
    throw new Error("Path traversal detected");
  }
  return resolved;
}

function metaFilePath(assetAbsPath: string): string {
  return assetAbsPath + ".meta";
}

async function computeHash(filePath: string): Promise<string> {
  const hash = crypto.createHash("sha256");
  const content = await fs.readFile(filePath);
  hash.update(content);
  return hash.digest("hex");
}

function buildDefaultMeta(type: MetaType, hash: string): AnyMeta {
  const now = new Date().toISOString();
  const base = {
    guid: randomUUID(),
    hash,
    createdAt: now,
    updatedAt: now,
  };

  switch (type) {
    case "texture":
      return {
        ...base,
        type: "texture",
        width: 0,
        height: 0,
        format: "rgba8unorm",
        generateMipmaps: true,
        magFilter: "linear",
        minFilter: "linear",
        mipmapFilter: "linear",
        addressModeU: "repeat",
        addressModeV: "repeat",
      };
    case "audio":
      return {
        ...base,
        type: "audio",
        duration: 0,
        sampleRate: 0,
        channels: 0,
      };
    case "model":
      return {
        ...base,
        type: "model",
        vertexCount: 0,
        triangleCount: 0,
      };
    case "directory":
      return { ...base, type: "directory", hash: "" };
    case "script":
      return { ...base, type: "script" };
    case "material":
      return { ...base, type: "material" };
    case "scene":
      return { ...base, type: "scene" };
    case "prefab":
      return { ...base, type: "prefab" };
    default:
      return { ...base, type: "unknown" };
  }
}

export class MetaService {
  static init(projectsPath: string): void {
    projectsRoot = path.resolve(projectsPath);
  }

  async create(projectId: string, relativePath: string): Promise<AnyMeta> {
    const abs = resolveAssetPath(projectId, relativePath);
    const ext = path.extname(relativePath);
    const type = getMetaType(ext);
    const hash = type === "directory" ? "" : await computeHash(abs);
    const meta = buildDefaultMeta(type, hash);

    await fs.writeFile(metaFilePath(abs), JSON.stringify(meta, null, 2), {
      flag: "wx",
    });

    return meta;
  }

  async read(projectId: string, relativePath: string): Promise<AnyMeta | null> {
    const abs = resolveAssetPath(projectId, relativePath);
    try {
      const raw = await fs.readFile(metaFilePath(abs), "utf-8");
      return JSON.parse(raw) as AnyMeta;
    } catch {
      return null;
    }
  }

  async update(
    projectId: string,
    relativePath: string,
    partial: Partial<AnyMeta>,
  ): Promise<AnyMeta> {
    const existing = await this.read(projectId, relativePath);
    if (!existing) throw new Error(`Meta not found: ${relativePath}`);

    const updated: AnyMeta = {
      ...existing,
      ...partial,
      guid: existing.guid,
      type: existing.type,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    } as AnyMeta;

    const abs = resolveAssetPath(projectId, relativePath);
    await fs.writeFile(metaFilePath(abs), JSON.stringify(updated, null, 2));

    return updated;
  }

  async updateHash(projectId: string, relativePath: string): Promise<void> {
    const abs = resolveAssetPath(projectId, relativePath);
    const hash = await computeHash(abs);
    await this.update(projectId, relativePath, { hash });
  }

  async delete(projectId: string, relativePath: string): Promise<void> {
    const abs = resolveAssetPath(projectId, relativePath);
    try {
      await fs.unlink(metaFilePath(abs));
    } catch {}
  }

  async move(
    projectId: string,
    fromRelative: string,
    toRelative: string,
  ): Promise<void> {
    const absFrom = resolveAssetPath(projectId, fromRelative);
    const absTo = resolveAssetPath(projectId, toRelative);

    try {
      await fs.rename(metaFilePath(absFrom), metaFilePath(absTo));
    } catch {
      throw new Error(`Failed to move meta: ${fromRelative} -> ${toRelative}`);
    }
  }

  async rename(
    projectId: string,
    relativePath: string,
    newName: string,
  ): Promise<void> {
    const abs = resolveAssetPath(projectId, relativePath);
    const absNew = path.join(path.dirname(abs), newName);

    try {
      await fs.rename(metaFilePath(abs), metaFilePath(absNew));
    } catch {
      throw new Error(`Failed to rename meta: ${relativePath} -> ${newName}`);
    }

    const oldExt = path.extname(relativePath);
    const newExt = path.extname(newName);

    if (oldExt.toLowerCase() === newExt.toLowerCase()) return;

    const newType = getMetaType(newExt);
    const newRelative = path.join(path.dirname(relativePath), newName);
    const existing = await this.read(projectId, newRelative);
    if (!existing) return;

    const hash = await computeHash(absNew);
    const updated = buildDefaultMeta(newType, hash);
    updated.guid = existing.guid;
    updated.createdAt = existing.createdAt;
    updated.updatedAt = new Date().toISOString();

    await fs.writeFile(metaFilePath(absNew), JSON.stringify(updated, null, 2));
  }
}

export const metaService = new MetaService();
