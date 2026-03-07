import {
  DEFAULT_EXCLUDE,
  type FileNode,
  type ScanOptions,
  type ScanResult,
} from "@proton/shared";
import fs from "fs/promises";
import path from "path";

function isExcluded(ext: string, options: ScanOptions): boolean {
  const excluded = [
    ...DEFAULT_EXCLUDE,
    ...(options.excludeExtensions ?? []),
  ].map((e) => e.toLowerCase());

  if (excluded.includes(ext.toLowerCase())) return true;

  if (options.includeExtensions && options.includeExtensions.length > 0) {
    return !options.includeExtensions
      .map((e) => e.toLowerCase())
      .includes(ext.toLowerCase());
  }

  return false;
}

async function countEntries(
  dirPath: string,
  options: ScanOptions,
): Promise<number> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    let count = 0;
    for (const entry of entries) {
      if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (!isExcluded(ext, options)) count++;
      } else if (entry.isDirectory()) {
        count++;
      }
    }
    return count;
  } catch {
    return 0;
  }
}

async function scanDirectory(
  dirPath: string,
  relativeBase: string,
  options: ScanOptions,
  depth: number,
  applyPagination: boolean,
): Promise<ScanResult> {
  const limit = options.limit ?? 50;
  const offset = applyPagination ? (options.offset ?? 0) : 0;
  const maxDepth = options.maxDepth ?? Infinity;

  let entries;
  try {
    entries = await fs.readdir(dirPath, { withFileTypes: true });
  } catch {
    return { nodes: [], total: 0, hasMore: false };
  }

  const filtered: typeof entries = [];
  for (const entry of entries) {
    if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (!isExcluded(ext, options)) filtered.push(entry);
    } else if (entry.isDirectory()) {
      filtered.push(entry);
    }
  }

  const total = filtered.length;
  const paginated = applyPagination
    ? filtered.slice(offset, offset + limit)
    : filtered;
  const hasMore = applyPagination ? offset + limit < total : false;

  const nodes: FileNode[] = [];

  for (const entry of paginated) {
    const entryRelative = path.join(relativeBase, entry.name);
    const entryAbs = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      const childTotal = await countEntries(entryAbs, options);
      const node: FileNode = {
        name: entry.name,
        path: entryRelative,
        type: "directory",
        total: childTotal,
        hasMore: false,
        children: [],
      };

      if (options.recursive && depth < maxDepth) {
        const childResult = await scanDirectory(
          entryAbs,
          entryRelative,
          options,
          depth + 1,
          true,
        );
        node.children = childResult.nodes;
        node.hasMore = childResult.hasMore;
      }

      nodes.push(node);
    } else {
      const ext = path.extname(entry.name);
      let size: number = -1;
      try {
        const stat = await fs.stat(entryAbs);
        size = stat.size;
      } catch {}

      const node: FileNode = {
        name: entry.name,
        path: entryRelative,
        type: "file",
        ext: ext,
        size: size,
      };

      nodes.push(node);
    }
  }

  return { nodes, total, hasMore };
}

export async function scanAssets(
  rootPath: string,
  relativePath: string,
  options: ScanOptions = {},
): Promise<ScanResult> {
  const targetPath = path.resolve(rootPath, relativePath);
  return scanDirectory(targetPath, relativePath, options, 0, true);
}
