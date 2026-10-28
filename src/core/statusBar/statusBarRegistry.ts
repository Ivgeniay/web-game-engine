import type { ComponentType } from 'react';
import { createRegistry } from '@/core/registry/registry';
import type { Unsubscribe } from '@/core/unsubscribe';

export const STATUS_BAR_ZONES = ['left', 'right'] as const;

export type StatusBarZone = (typeof STATUS_BAR_ZONES)[number];

export interface StatusBarItem {
  readonly id: string;
  readonly zone: StatusBarZone;
  readonly order: number;
  readonly component: ComponentType;
  readonly announce?: boolean | undefined;
}

export interface StatusBarRegistry {
  readonly register: (item: StatusBarItem) => Unsubscribe;
  readonly getItems: () => readonly StatusBarItem[];
  readonly subscribe: (listener: () => void) => Unsubscribe;
}

export function createStatusBarRegistry(): StatusBarRegistry {
  const items = createRegistry<StatusBarItem>({
    kind: 'status bar item',
    getId: (item) => item.id,
  });

  return { register: items.register, getItems: items.getSnapshot, subscribe: items.subscribe };
}

export function statusBarZoneItems(
  items: readonly StatusBarItem[],
  zone: StatusBarZone,
): StatusBarItem[] {
  return items
    .filter((item) => item.zone === zone)
    .sort((first, second) => first.order - second.order);
}
