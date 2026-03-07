import { useMemo } from "react";
import type { IconConfig, IconProps } from "./types";

function getIconConfig(ext: string): IconConfig {
  const e = ext.toLowerCase().replace(/^\./, "");

  switch (e) {
    case "png":
    case "jpg":
    case "jpeg":
    case "webp":
    case "bmp":
    case "tga":
      return { color: "#4ec9b0", badge: e };
    case "hdr":
    case "exr":
      return { color: "#4ec9b0", badge: e };
    case "mp3":
    case "wav":
    case "ogg":
    case "flac":
      return { color: "#c586c0", badge: e };
    case "ts":
    case "js":
      return { color: "#569cd6", badge: e };
    case "glb":
    case "gltf":
    case "obj":
    case "fbx":
      return { color: "#ce9178", badge: e };
    case "scene":
      return { color: "#dcdcaa", badge: "SCN" };
    case "prefab":
      return { color: "#9cdcfe", badge: "PRF" };
    case "material":
    case "mat":
      return { color: "#b5cea8", badge: "MAT" };
    case "directory":
    case "":
      return { color: "#e2c08d", isDir: true };
    default:
      return { color: "#858585", badge: "???" };
  }
}

function DirectoryIcon({ color, size }: { color: string; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 3.5C1 2.67 1.67 2 2.5 2H6.086C6.48 2 6.857 2.158 7.134 2.44L8 3.5H13.5C14.33 3.5 15 4.17 15 5V12.5C15 13.33 14.33 14 13.5 14H2.5C1.67 14 1 13.33 1 12.5V3.5Z"
        fill={color}
        fillOpacity="0.85"
      />
      <path
        d="M1 5.5H15V12.5C15 13.33 14.33 14 13.5 14H2.5C1.67 14 1 13.33 1 12.5V5.5Z"
        fill={color}
      />
    </svg>
  );
}

function FileIconShape({
  color,
  badge,
  size,
}: {
  color: string;
  badge: string;
  size: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 1H10L14 5V15C14 15.55 13.55 16 13 16H3C2.45 16 2 15.55 2 15V2C2 1.45 2.45 1 3 1Z"
        fill="#2d2d2d"
        stroke={color}
        strokeWidth="0.75"
      />
      <path
        d="M10 1L14 5H11C10.45 5 10 4.55 10 4V1Z"
        fill={color}
        fillOpacity="0.6"
      />
      <text
        x="8"
        y="12"
        textAnchor="middle"
        fill={color}
        fontSize="6.5"
        fontFamily="monospace"
        fontWeight="bold"
        letterSpacing="-0.3"
      >
        {badge}
      </text>
    </svg>
  );
}

export function FileIcon({ ext = "", size = 16, className }: IconProps) {
  const config = useMemo(() => getIconConfig(ext), [ext]);

  return (
    <span
      className={className}
      style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}
    >
      {config.isDir ? (
        <DirectoryIcon color={config.color} size={size} />
      ) : (
        <FileIconShape
          color={config.color}
          badge={config.badge ?? "???"}
          size={size}
        />
      )}
    </span>
  );
}
