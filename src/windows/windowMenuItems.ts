import { defineCommand } from '@/core/commands/command';
import { MENU_PATH_SEPARATOR } from '@/core/menus/menuTree';
import { combineUnsubscribes } from '@/core/unsubscribe';
import type { Unsubscribe } from '@/core/unsubscribe';
import type { WindowType } from '@/core/windows/windowType';
import type { EditorRegistries } from '@/state/registries/editorRegistries';

export interface WindowMenuItemsOptions {
  readonly menuPath: string;
  readonly group: number;
}

const OPEN_WINDOW_COMMAND_PREFIX = 'window.open.';

function openWindowCommandId(windowType: WindowType): string {
  return `${OPEN_WINDOW_COMMAND_PREFIX}${windowType.id}`;
}

function registerWindowItem(
  { commands, mainMenu, workspace }: EditorRegistries,
  { menuPath, group }: WindowMenuItemsOptions,
  windowType: WindowType,
  order: number,
): Unsubscribe {
  const command = defineCommand({
    id: openWindowCommandId(windowType),
    label: windowType.title,
    icon: windowType.icon,
  });

  return combineUnsubscribes(
    commands.handle(command, {
      run: () => {
        workspace.open(windowType);
      },
      isEnabled: () => workspace.isAttached(),
    }),
    mainMenu.registerItem({
      path: `${menuPath}${MENU_PATH_SEPARATOR}${windowType.id}`,
      command,
      group,
      order,
    }),
  );
}

export function registerWindowMenuItems(
  editor: EditorRegistries,
  options: WindowMenuItemsOptions,
): Unsubscribe {
  const { windows } = editor;
  let unregisterItems: Unsubscribe = combineUnsubscribes();

  function sync(): void {
    unregisterItems();
    unregisterItems = combineUnsubscribes(
      ...windows
        .getSnapshot()
        .map((windowType, order) => registerWindowItem(editor, options, windowType, order)),
    );
  }

  sync();
  const unsubscribeWindows = windows.subscribe(sync);

  return () => {
    unsubscribeWindows();
    unregisterItems();
  };
}
