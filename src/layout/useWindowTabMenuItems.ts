import { useSyncExternalStore } from 'react';
import { buildMenuTree } from '@/core/menus/menuTree';
import { windowTabMenu } from '@/core/windows/windowTabMenu';
import type { WindowTabTarget, WindowType } from '@/core/windows/windowType';
import { menuItemsFromTree, runAfterMenuCloses } from '@/shell/menuItemsFromTree';
import type { MenuBuildContext } from '@/shell/menuItemsFromTree';
import { useMessages } from '@/state/language/useMessages';
import { useTranslate } from '@/state/language/useTranslate';
import { useFormatShortcut } from '@/state/platform/useFormatShortcut';
import { useEditorRegistries } from '@/state/registries/registriesContext';
import type { MenuItem } from '@/contracts/menu';
import { layoutMessages } from './layoutMessages';

const NO_ITEMS: readonly MenuItem[] = [];
const WINDOW_ITEM_ID_PREFIX = 'window:';
const FRAMEWORK_ITEM_ID_PREFIX = 'framework:';
const ADD_TAB_ID = 'add-tab';
const SEPARATOR_ID_PREFIX = 'window-tab-separator-';

function withIdPrefix(items: readonly MenuItem[], prefix: string): MenuItem[] {
  return items.map((item) =>
    item.kind === 'submenu'
      ? { ...item, id: `${prefix}${item.id}`, items: withIdPrefix(item.items, prefix) }
      : { ...item, id: `${prefix}${item.id}` },
  );
}

function joinSections(sections: readonly (readonly MenuItem[])[]): MenuItem[] {
  return sections
    .filter((items) => items.length > 0)
    .flatMap((items, index) =>
      index === 0
        ? items
        : [{ kind: 'separator', id: `${SEPARATOR_ID_PREFIX}${String(index)}` }, ...items],
    );
}

export function useWindowTabMenuItems(target: WindowTabTarget | null): readonly MenuItem[] {
  const { commands, contextMenus, windows, workspace } = useEditorRegistries();
  useSyncExternalStore(contextMenus.subscribe, contextMenus.getVersion);
  useSyncExternalStore(commands.subscribe, commands.getVersion);
  useSyncExternalStore(workspace.subscribe, workspace.getVersion);
  const windowTypes = useSyncExternalStore(windows.subscribe, windows.getSnapshot);
  const translate = useTranslate();
  const formatShortcut = useFormatShortcut();
  const messages = useMessages(layoutMessages);

  if (target === null) {
    return NO_ITEMS;
  }

  const context: MenuBuildContext<WindowTabTarget> = {
    commands,
    source: 'context-menu',
    target,
    translate,
    formatShortcut,
  };
  const windowType = windows.get(target.windowType);
  const windowItems =
    windowType === undefined
      ? NO_ITEMS
      : menuItemsFromTree(buildMenuTree(contextMenus.getEntries(windowType.tabMenu)), context);
  const frameworkItems = menuItemsFromTree(
    buildMenuTree(contextMenus.getEntries(windowTabMenu)),
    context,
  );

  function addTabItem(type: WindowType): MenuItem {
    return {
      kind: 'action',
      id: type.id,
      label: translate(type.title),
      icon: type.icon,
      disabled: !type.multiInstance && workspace.isOpen(type),
      onSelect: () => {
        runAfterMenuCloses(() => {
          workspace.open(type, { besideWindow: target?.windowId });
        });
      },
    };
  }

  const addTab: MenuItem = {
    kind: 'submenu',
    id: ADD_TAB_ID,
    label: messages('addTab'),
    disabled: windowTypes.length === 0,
    items: windowTypes.map(addTabItem),
  };

  return joinSections([
    withIdPrefix(windowItems, WINDOW_ITEM_ID_PREFIX),
    withIdPrefix([...frameworkItems, addTab], FRAMEWORK_ITEM_ID_PREFIX),
  ]);
}
