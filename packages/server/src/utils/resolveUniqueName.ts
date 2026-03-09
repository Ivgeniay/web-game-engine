import fsp from "fs/promises";
import path from "path";

export async function resolveUniqueName(
  dirAbsPath: string,
  defaultName: string,
  type: "file" | "directory",
): Promise<string> {
  let entries: string[];

  try {
    const dirents = await fsp.readdir(dirAbsPath, { withFileTypes: true });
    entries = dirents
      .filter((d) => (type === "directory" ? d.isDirectory() : d.isFile()))
      .map((d) => d.name);
  } catch {
    return defaultName;
  }

  const ext = path.extname(defaultName);
  const base = ext ? defaultName.slice(0, -ext.length) : defaultName;
  const pattern = new RegExp(
    `^${escapeRegex(base)}(?: \\((\\d+)\\))?${escapeRegex(ext)}$`,
  );

  const taken = new Set<number>();

  for (const name of entries) {
    const match = pattern.exec(name);
    if (!match) continue;
    taken.add(match[1] ? parseInt(match[1], 10) : 1);
  }

  if (!taken.has(1)) return defaultName;

  let n = 2;
  while (taken.has(n)) n++;

  return `${base} (${n})${ext}`;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
