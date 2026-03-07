import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import type { Readable } from "stream";
import type { ScanOptions, ScanResult } from "@proton/shared";
import { metaService } from "./MetaService.js";
import { scanAssets } from "../utils/scanAssets.js";

let projectsRoot: string | null = null;

function getProjectsRoot(): string {
  if (!projectsRoot) throw new Error("FileService not initialized");
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

async function generateUniquePath(absPath: string): Promise<string> {
  const ext = path.extname(absPath);
  const base = absPath.slice(0, -ext.length);
  let counter = 2;
  let candidate = absPath;

  while (true) {
    try {
      await fsp.access(candidate);
      candidate = `${base} (${counter})${ext}`;
      counter++;
    } catch {
      return candidate;
    }
  }
}

export class FileService {
  static init(projectsPath: string): void {
    projectsRoot = path.resolve(projectsPath);
  }

  private async _writeStream(abs: string, stream: Readable): Promise<void> {
    await fsp.mkdir(path.dirname(abs), { recursive: true });
    await new Promise<void>((resolve, reject) => {
      const writer = fs.createWriteStream(abs);
      stream.pipe(writer);
      writer.on("finish", resolve);
      writer.on("error", reject);
      stream.on("error", reject);
    });
  }

  async uploadFile(
    projectId: string,
    relativePath: string,
    stream: Readable,
  ): Promise<string> {
    const abs = resolveAssetPath(projectId, relativePath);

    let targetAbs = abs;
    let targetRelative = relativePath;

    try {
      await fsp.access(abs);
      targetAbs = await generateUniquePath(abs);
      targetRelative = path.relative(assetsRoot(projectId), targetAbs);
    } catch {}

    await this._writeStream(targetAbs, stream);
    await metaService.create(projectId, targetRelative);

    return targetRelative;
  }

  async overwriteFile(
    projectId: string,
    relativePath: string,
    stream: Readable,
  ): Promise<void> {
    const abs = resolveAssetPath(projectId, relativePath);
    await this._writeStream(abs, stream);
    await metaService.updateHash(projectId, relativePath);
  }

  async createFile(
    projectId: string,
    relativePath: string,
    content: Buffer | string = "",
  ): Promise<void> {
    const abs = resolveAssetPath(projectId, relativePath);
    await fsp.mkdir(path.dirname(abs), { recursive: true });
    await fsp.writeFile(abs, content, { flag: "wx" });
    await metaService.create(projectId, relativePath);
  }

  async createDirectory(
    projectId: string,
    relativePath: string,
  ): Promise<void> {
    const abs = resolveAssetPath(projectId, relativePath);
    await fsp.mkdir(abs, { recursive: true });
    await metaService.create(projectId, relativePath);
  }

  async deleteFile(projectId: string, relativePath: string): Promise<void> {
    const abs = resolveAssetPath(projectId, relativePath);
    await fsp.unlink(abs);
    await metaService.delete(projectId, relativePath);
  }

  async deleteDirectory(
    projectId: string,
    relativePath: string,
  ): Promise<void> {
    const abs = resolveAssetPath(projectId, relativePath);
    await fsp.rm(abs, { recursive: true, force: true });
    await metaService.delete(projectId, relativePath);
  }

  async moveFile(
    projectId: string,
    fromRelative: string,
    toRelative: string,
  ): Promise<void> {
    const absFrom = resolveAssetPath(projectId, fromRelative);
    const absTo = resolveAssetPath(projectId, toRelative);

    await fsp.mkdir(path.dirname(absTo), { recursive: true });
    await fsp.rename(absFrom, absTo);

    try {
      await metaService.move(projectId, fromRelative, toRelative);
    } catch {
      await fsp.rename(absTo, absFrom).catch(() => {});
      throw new Error(`Failed to move meta: ${fromRelative}`);
    }
  }

  async moveDirectory(
    projectId: string,
    fromRelative: string,
    toRelative: string,
  ): Promise<void> {
    const absFrom = resolveAssetPath(projectId, fromRelative);
    const absTo = resolveAssetPath(projectId, toRelative);

    await fsp.mkdir(path.dirname(absTo), { recursive: true });
    await fsp.rename(absFrom, absTo);

    try {
      await metaService.move(projectId, fromRelative, toRelative);
    } catch {
      await fsp.rename(absTo, absFrom).catch(() => {});
      throw new Error(`Failed to move meta: ${fromRelative}`);
    }
  }

  async renameFile(
    projectId: string,
    relativePath: string,
    newName: string,
  ): Promise<void> {
    const abs = resolveAssetPath(projectId, relativePath);
    const absNew = path.join(path.dirname(abs), newName);
    resolveAssetPath(projectId, path.relative(assetsRoot(projectId), absNew));

    await fsp.rename(abs, absNew);

    try {
      await metaService.rename(projectId, relativePath, newName);
    } catch {
      await fsp.rename(absNew, abs).catch(() => {});
      throw new Error(`Failed to rename meta: ${relativePath}`);
    }
  }

  async renameDirectory(
    projectId: string,
    relativePath: string,
    newName: string,
  ): Promise<void> {
    const abs = resolveAssetPath(projectId, relativePath);
    const absNew = path.join(path.dirname(abs), newName);
    resolveAssetPath(projectId, path.relative(assetsRoot(projectId), absNew));

    await fsp.rename(abs, absNew);

    try {
      await metaService.rename(projectId, relativePath, newName);
    } catch {
      await fsp.rename(absNew, abs).catch(() => {});
      throw new Error(`Failed to rename meta directory: ${relativePath}`);
    }
  }

  async readFile(projectId: string, relativePath: string): Promise<Buffer> {
    const abs = resolveAssetPath(projectId, relativePath);
    return fsp.readFile(abs);
  }

  async writeFile(
    projectId: string,
    relativePath: string,
    content: Buffer | string,
  ): Promise<void> {
    const abs = resolveAssetPath(projectId, relativePath);
    await fsp.writeFile(abs, content);
    await metaService.updateHash(projectId, relativePath);
  }

  readStream(projectId: string, relativePath: string): fs.ReadStream {
    const abs = resolveAssetPath(projectId, relativePath);
    return fs.createReadStream(abs);
  }

  async listAssets(
    projectId: string,
    relativePath: string,
    options?: ScanOptions,
  ): Promise<ScanResult> {
    const root = assetsRoot(projectId);
    return scanAssets(root, relativePath, options);
  }

  async exists(projectId: string, relativePath: string): Promise<boolean> {
    const abs = resolveAssetPath(projectId, relativePath);
    return fsp
      .access(abs)
      .then(() => true)
      .catch(() => false);
  }
}

export const fileService = new FileService();
