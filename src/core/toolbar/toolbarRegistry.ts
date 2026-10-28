import type { ComponentType } from 'react';
import type { CommandDefinition } from '@/core/commands/command';
import { createRegistry } from '@/core/registry/registry';
import type { Unsubscribe } from '@/core/unsubscribe';

export const TOOLBAR_ZONES = ['left', 'center', 'right'] as const;

export type ToolbarZone = (typeof TOOLBAR_ZONES)[number];

interface ToolbarItemPlacement {
  readonly id: string;
  readonly zone: ToolbarZone;
  readonly group: number;
  readonly order: number;
}

export interface ToolbarCommandItem extends ToolbarItemPlacement {
  readonly kind: 'command';
  readonly command: CommandDefinition;
}

export interface ToolbarComponentItem extends ToolbarItemPlacement {
  readonly kind: 'component';
  readonly component: ComponentType;
}

export type ToolbarItem = ToolbarCommandItem | ToolbarComponentItem;

export interface ToolbarRegistry {
  readonly register: (item: ToolbarItem) => Unsubscribe;
  readonly getItems: () => readonly ToolbarItem[];
  readonly subscribe: (listener: () => void) => Unsubscribe;
}

export function createToolbarRegistry(): ToolbarRegistry {
  const items = createRegistry<ToolbarItem>({ kind: 'toolbar item', getId: (item) => item.id });

  return { register: items.register, getItems: items.getSnapshot, subscribe: items.subscribe };
}

function comparePlacement(first: ToolbarItem, second: ToolbarItem): number {
  return first.group - second.group || first.order - second.order;
}

export function toolbarZoneGroups(
  items: readonly ToolbarItem[],
  zone: ToolbarZone,
): ToolbarItem[][] {
  const groups: ToolbarItem[][] = [];
  let currentGroup: number | null = null;

  for (const item of items.filter((candidate) => candidate.zone === zone).sort(comparePlacement)) {
    if (item.group !== currentGroup) {
      groups.push([]);
      currentGroup = item.group;
    }

    groups.at(-1)?.push(item);
  }

  return groups;
}
