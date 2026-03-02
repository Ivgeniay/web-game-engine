export interface MenuBarChild {
  id: string;
  label: string;
  shortcut?: string;
  disabled?: boolean;
  separator?: boolean;
  children?: MenuBarChild[];
  onClick?: () => void;
}

export interface MenuBarItem {
  id: string;
  label: string;
  children?: MenuBarChild[];
}

export interface MenuBarRegistry {
  id: string;
  items: MenuBarItem[];
}
