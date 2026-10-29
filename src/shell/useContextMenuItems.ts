import { useSyncExternalStore } from 'react';
import type { ContextMenuContext } from '@/core/menus/contextMenuRegistry';
import { buildMenuTree } from '@/core/menus/menuTree';
import { useTranslate } from '@/state/language/useTranslate';
import { useFormatShortcut } from '@/state/platform/useFormatShortcut';
import { useEditorRegistries } from '@/state/registries/registriesContext';
import type { MenuItem } from '@/ui/menu/menuItems';
import { menuItemsFromTree } from './menuItemsFromTree';

export function useContextMenuItems<TTarget>(
  context: ContextMenuContext<TTarget>,
  target: TTarget,
): readonly MenuItem[] {
  const { contextMenus, commands } = useEditorRegistries();
  useSyncExternalStore(contextMenus.subscribe, contextMenus.getVersion);
  useSyncExternalStore(commands.subscribe, commands.getVersion);
  const translate = useTranslate();
  const formatShortcut = useFormatShortcut();

  return menuItemsFromTree(buildMenuTree(contextMenus.getEntries(context)), {
    commands,
    source: 'context-menu',
    target,
    translate,
    formatShortcut,
  });
}
