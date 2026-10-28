import { createContext } from 'react';
import type { HTMLProps } from 'react';

export interface MenuLevelContextValue {
  readonly activeIndex: number | null;
  readonly getItemProps: (userProps?: HTMLProps<HTMLElement>) => Record<string, unknown>;
  readonly selectAndClose: () => void;
}

export const MenuLevelContext = createContext<MenuLevelContextValue | null>(null);
