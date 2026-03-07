import { client } from "./client";
import type {
  ScanOptions,
  ScanResult,
  AnyMeta,
  MoveBody,
  RenameBody,
  CreateFileBody,
  CreateDirBody,
} from "@proton/shared";

function buildScanQuery(options?: ScanOptions): string {
  if (!options) return "";
  const params = new URLSearchParams();
  if (options.recursive !== undefined)
    params.set("recursive", String(options.recursive));
  if (options.offset !== undefined)
    params.set("offset", String(options.offset));
  if (options.limit !== undefined) params.set("limit", String(options.limit));
  if (options.maxDepth !== undefined)
    params.set("maxDepth", String(options.maxDepth));
  if (options.excludeExtensions?.length)
    params.set("excludeExtensions", options.excludeExtensions.join(","));
  if (options.includeExtensions?.length)
    params.set("includeExtensions", options.includeExtensions.join(","));
  const str = params.toString();
  return str ? `&${str}` : "";
}

export const filesApi = {
  listAssets: async (
    projectId: string,
    path: string,
    options?: ScanOptions,
  ): Promise<ScanResult> => {
    const query = buildScanQuery(options);
    const res = await client.get(
      `/projects/${projectId}/assets?path=${encodeURIComponent(path)}${query}`,
    );
    if (!res.ok) throw new Error("Failed to list assets");
    return res.json() as Promise<ScanResult>;
  },

  getMeta: async (projectId: string, path: string): Promise<AnyMeta> => {
    const res = await client.get(
      `/projects/${projectId}/assets/meta?path=${encodeURIComponent(path)}`,
    );
    if (!res.ok) throw new Error("Failed to get meta");
    return res.json() as Promise<AnyMeta>;
  },

  createFile: async (
    projectId: string,
    body: CreateFileBody,
  ): Promise<void> => {
    const res = await client.post(`/projects/${projectId}/assets/file`, body);
    if (!res.ok) throw new Error("Failed to create file");
  },

  createDirectory: async (
    projectId: string,
    body: CreateDirBody,
  ): Promise<void> => {
    const res = await client.post(
      `/projects/${projectId}/assets/directory`,
      body,
    );
    if (!res.ok) throw new Error("Failed to create directory");
  },

  uploadFile: async (
    projectId: string,
    path: string,
    file: File,
  ): Promise<string> => {
    const res = await client.upload(
      `/projects/${projectId}/assets/upload?path=${encodeURIComponent(path)}`,
      file,
    );
    if (!res.ok) throw new Error("Failed to upload file");
    const data = (await res.json()) as { path: string };
    return data.path;
  },

  overwriteFile: async (
    projectId: string,
    path: string,
    file: File,
  ): Promise<void> => {
    const res = await client.overwrite(
      `/projects/${projectId}/assets/upload?path=${encodeURIComponent(path)}`,
      file,
    );
    if (!res.ok) throw new Error("Failed to overwrite file");
  },

  downloadFile: (projectId: string, path: string): string => {
    const API_URL = import.meta.env["VITE_API_URL"] as string;
    return `${API_URL}/projects/${projectId}/assets/download?path=${encodeURIComponent(path)}`;
  },

  moveFile: async (projectId: string, body: MoveBody): Promise<void> => {
    const res = await client.patch(
      `/projects/${projectId}/assets/file/move`,
      body,
    );
    if (!res.ok) throw new Error("Failed to move file");
  },

  moveDirectory: async (projectId: string, body: MoveBody): Promise<void> => {
    const res = await client.patch(
      `/projects/${projectId}/assets/directory/move`,
      body,
    );
    if (!res.ok) throw new Error("Failed to move directory");
  },

  renameFile: async (projectId: string, body: RenameBody): Promise<void> => {
    const res = await client.patch(
      `/projects/${projectId}/assets/file/rename`,
      body,
    );
    if (!res.ok) throw new Error("Failed to rename file");
  },

  renameDirectory: async (
    projectId: string,
    body: RenameBody,
  ): Promise<void> => {
    const res = await client.patch(
      `/projects/${projectId}/assets/directory/rename`,
      body,
    );
    if (!res.ok) throw new Error("Failed to rename directory");
  },

  deleteFile: async (projectId: string, path: string): Promise<void> => {
    const res = await client.delete(
      `/projects/${projectId}/assets/file?path=${encodeURIComponent(path)}`,
    );
    if (!res.ok) throw new Error("Failed to delete file");
  },

  deleteDirectory: async (projectId: string, path: string): Promise<void> => {
    const res = await client.delete(
      `/projects/${projectId}/assets/directory?path=${encodeURIComponent(path)}`,
    );
    if (!res.ok) throw new Error("Failed to delete directory");
  },
};
