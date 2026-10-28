import { useSyncExternalStore } from 'react';
import type { ContextMenuContext } from '@/core/menus/contextMenuRegistry';
import { buildMenuTree } from '@/core/menus/menuTree';
import { useTranslate } from '@/state/language/useTranslate';
import { useFormatShortcut } from '@/state/platform/useFormatShortcut';
import { useEditorRegistries } from '@/state/registries/registriesContext';
import { Menu } from '@/ui/menu/Menu';
import type { MenuItem, MenuPoint } from '@/ui/menu/menuItems';
import { menuItemsFromTree } from './menuItemsFromTree';

export interface ContextMenuRequest<TTarget> {
  readonly point: MenuPoint;
  readonly target: TTarget;
}

interface ContextMenuProps<TTarget> {
  readonly context: ContextMenuContext<TTarget>;
  readonly request: ContextMenuRequest<TTarget> | null;
  readonly onClose: () => void;
}

const NO_ITEMS: readonly MenuItem[] = [];

export function ContextMenu<TTarget>({ context, request, onClose }: ContextMenuProps<TTarget>) {
  const { contextMenus, commands } = useEditorRegistries();
  useSyncExternalStore(contextMenus.subscribe, contextMenus.getVersion);
  useSyncExternalStore(commands.subscribe, commands.getVersion);
  const translate = useTranslate();
  const formatShortcut = useFormatShortcut();

  const items =
    request === null
      ? NO_ITEMS
      : menuItemsFromTree(buildMenuTree(contextMenus.getEntries(context)), {
          commands,
          source: 'context-menu',
          target: request.target,
          translate,
          formatShortcut,
        });

  return (
    <Menu
      label={translate(context.label)}
      items={items}
      point={request?.point ?? null}
      onClose={onClose}
    />
  );
}
