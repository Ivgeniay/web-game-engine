export interface FileNode {
  name: string;
  path: string;
  type: "file" | "directory";
  ext?: string;
  size?: number;
  children?: FileNode[];
  total?: number;
  hasMore?: boolean;
}

export interface ScanResult {
  nodes: FileNode[];
  total: number;
  hasMore: boolean;
}

export interface ScanOptions {
  recursive?: boolean;
  excludeExtensions?: string[];
  includeExtensions?: string[];
  maxDepth?: number;
  offset?: number;
  limit?: number;
}

export const DEFAULT_EXCLUDE = [".meta"];

export interface MoveBody {
  fromPath: string;
  toPath: string;
}

export interface RenameBody {
  path: string;
  newName: string;
}

export interface CreateFileBody {
  path: string;
}

export interface CreateDirBody {
  path: string;
}
