type GPUTextureFormat =
  | "r8unorm"
  | "r8snorm"
  | "r8uint"
  | "r8sint"
  | "r16unorm"
  | "r16snorm"
  | "r16uint"
  | "r16sint"
  | "r16float"
  | "rg8unorm"
  | "rg8snorm"
  | "rg8uint"
  | "rg8sint"
  | "r32uint"
  | "r32sint"
  | "r32float"
  | "rg16unorm"
  | "rg16snorm"
  | "rg16uint"
  | "rg16sint"
  | "rg16float"
  | "rgba8unorm"
  | "rgba8unorm-srgb"
  | "rgba8snorm"
  | "rgba8uint"
  | "rgba8sint"
  | "bgra8unorm"
  | "bgra8unorm-srgb"
  | "rgb9e5ufloat"
  | "rgb10a2uint"
  | "rgb10a2unorm"
  | "rg11b10ufloat"
  | "rg32uint"
  | "rg32sint"
  | "rg32float"
  | "rgba16unorm"
  | "rgba16snorm"
  | "rgba16uint"
  | "rgba16sint"
  | "rgba16float"
  | "rgba32uint"
  | "rgba32sint"
  | "rgba32float"
  | "stencil8"
  | "depth16unorm"
  | "depth24plus"
  | "depth24plus-stencil8"
  | "depth32float"
  | "depth32float-stencil8"
  | "bc1-rgba-unorm"
  | "bc1-rgba-unorm-srgb"
  | "bc2-rgba-unorm"
  | "bc2-rgba-unorm-srgb"
  | "bc3-rgba-unorm"
  | "bc3-rgba-unorm-srgb"
  | "bc4-r-unorm"
  | "bc4-r-snorm"
  | "bc5-rg-unorm"
  | "bc5-rg-snorm"
  | "bc6h-rgb-ufloat"
  | "bc6h-rgb-float"
  | "bc7-rgba-unorm"
  | "bc7-rgba-unorm-srgb"
  | "etc2-rgb8unorm"
  | "etc2-rgb8unorm-srgb"
  | "etc2-rgb8a1unorm"
  | "etc2-rgb8a1unorm-srgb"
  | "etc2-rgba8unorm"
  | "etc2-rgba8unorm-srgb"
  | "eac-r11unorm"
  | "eac-r11snorm"
  | "eac-rg11unorm"
  | "eac-rg11snorm"
  | "astc-4x4-unorm"
  | "astc-4x4-unorm-srgb"
  | "astc-5x4-unorm"
  | "astc-5x4-unorm-srgb"
  | "astc-5x5-unorm"
  | "astc-5x5-unorm-srgb"
  | "astc-6x5-unorm"
  | "astc-6x5-unorm-srgb"
  | "astc-6x6-unorm"
  | "astc-6x6-unorm-srgb"
  | "astc-8x5-unorm"
  | "astc-8x5-unorm-srgb"
  | "astc-8x6-unorm"
  | "astc-8x6-unorm-srgb"
  | "astc-8x8-unorm"
  | "astc-8x8-unorm-srgb"
  | "astc-10x5-unorm"
  | "astc-10x5-unorm-srgb"
  | "astc-10x6-unorm"
  | "astc-10x6-unorm-srgb"
  | "astc-10x8-unorm"
  | "astc-10x8-unorm-srgb"
  | "astc-10x10-unorm"
  | "astc-10x10-unorm-srgb"
  | "astc-12x10-unorm"
  | "astc-12x10-unorm-srgb"
  | "astc-12x12-unorm"
  | "astc-12x12-unorm-srgb";

type GPUFilterMode = "nearest" | "linear";
type GPUMipmapFilterMode = "nearest" | "linear";
type GPUAddressMode = "clamp-to-edge" | "repeat" | "mirror-repeat";

export type MetaType =
  | "directory"
  | "texture"
  | "audio"
  | "script"
  | "material"
  | "model"
  | "scene"
  | "prefab"
  | "unknown";

export interface BaseMeta {
  guid: string;
  type: MetaType;
  hash: string;
  createdAt: string;
  updatedAt: string;
}

export interface DirectoryMeta extends BaseMeta {
  type: "directory";
  hash: "";
}

export interface TextureMeta extends BaseMeta {
  type: "texture";
  width: number;
  height: number;
  format: GPUTextureFormat;
  generateMipmaps: boolean;
  magFilter: GPUFilterMode;
  minFilter: GPUFilterMode;
  mipmapFilter: GPUMipmapFilterMode;
  addressModeU: GPUAddressMode;
  addressModeV: GPUAddressMode;
}

export interface AudioMeta extends BaseMeta {
  type: "audio";
  duration: number;
  sampleRate: number;
  channels: number;
}

export interface ScriptMeta extends BaseMeta {
  type: "script";
}

export interface MaterialMeta extends BaseMeta {
  type: "material";
}

export interface ModelMeta extends BaseMeta {
  type: "model";
  vertexCount: number;
  triangleCount: number;
}

export interface SceneMeta extends BaseMeta {
  type: "scene";
}

export interface PrefabMeta extends BaseMeta {
  type: "prefab";
}

export interface UnknownMeta extends BaseMeta {
  type: "unknown";
}

export type AnyMeta =
  | DirectoryMeta
  | TextureMeta
  | AudioMeta
  | ScriptMeta
  | MaterialMeta
  | ModelMeta
  | SceneMeta
  | PrefabMeta
  | UnknownMeta;

export const metaExtensionMap: Record<string, MetaType> = {
  "": "unknown",
  ".directory": "directory",
  ".png": "texture",
  ".jpg": "texture",
  ".jpeg": "texture",
  ".webp": "texture",
  ".bmp": "texture",
  ".tga": "texture",
  ".hdr": "texture",
  ".mp3": "audio",
  ".wav": "audio",
  ".ogg": "audio",
  ".flac": "audio",
  ".ts": "script",
  ".js": "script",
  ".glb": "model",
  ".gltf": "model",
  ".obj": "model",
  ".fbx": "model",
};

export function getMetaType(ext: string): MetaType {
  return metaExtensionMap[ext.toLowerCase()] ?? "unknown";
}

export function getExtensionsByType(type: MetaType): string[] {
  return Object.entries(metaExtensionMap)
    .filter(([, t]) => t === type)
    .map(([ext]) => ext);
}
