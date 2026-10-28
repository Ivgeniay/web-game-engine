import type { ComponentType } from 'react';
import { defineContextMenu } from '@/core/menus/contextMenuRegistry';
import type { ContextMenuContext } from '@/core/menus/contextMenuRegistry';
import type { MessageRef } from '@/core/i18n/translate';
import type { IconSource } from '@/icons/icon';

export interface WindowContentProps {
  readonly windowId: string;
}

export interface WindowTabTarget {
  readonly windowId: string;
  readonly windowType: string;
}

export interface WindowTypeInput {
  readonly id: string;
  readonly title: MessageRef;
  readonly icon?: IconSource | undefined;
  readonly component: ComponentType<WindowContentProps>;
  readonly multiInstance?: boolean | undefined;
}

export interface WindowType {
  readonly id: string;
  readonly title: MessageRef;
  readonly icon: IconSource | undefined;
  readonly component: ComponentType<WindowContentProps>;
  readonly multiInstance: boolean;
  readonly tabMenu: ContextMenuContext<WindowTabTarget>;
}

const WINDOW_TAB_MENU_PREFIX = 'window-tab:';

export function defineWindow({
  id,
  title,
  icon,
  component,
  multiInstance = false,
}: WindowTypeInput): WindowType {
  return {
    id,
    title,
    icon,
    component,
    multiInstance,
    tabMenu: defineContextMenu<WindowTabTarget>({
      id: `${WINDOW_TAB_MENU_PREFIX}${id}`,
      label: title,
    }),
  };
}
