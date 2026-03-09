import type { TreeItem } from "../icons/types";

export enum MergeMode {
  Separator,
  Override,
}

export interface ContextMenuItem {
  id: string;
  label?: string;
  icon?: React.ComponentType<{ size?: number }>;
  action?: (item: TreeItem) => void;
  children?: ContextMenuItem[];
  disabled?: (item: TreeItem) => boolean;
  separator?: boolean;
}

export interface ContextMenuPosition {
  x: number;
  y: number;
}
