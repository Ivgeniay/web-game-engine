export interface IconProps {
  ext?: string;
  size?: number;
  className?: string;
}

export interface IconConfig {
  color: string;
  badge?: string;
  isDir?: boolean;
}

export interface TreeItem {
  id: string;
  label: string;
  ext?: string;
  children?: TreeItem[];
}
