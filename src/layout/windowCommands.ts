import { defineCommand } from '@/core/commands/command';
import { commonMessages } from '@/core/i18n/commonMessages';
import { messageRef } from '@/core/i18n/translate';
import { combineUnsubscribes } from '@/core/unsubscribe';
import type { Unsubscribe } from '@/core/unsubscribe';
import { WINDOW_TAB_MENU_FRAMEWORK_GROUP, windowTabMenu } from '@/core/windows/windowTabMenu';
import type { WindowTabTarget } from '@/core/windows/windowType';
import { frameworkIcons } from '@/icons/frameworkIcons';
import type { EditorRegistries } from '@/state/registries/editorRegistries';
import { layoutMessages } from './layoutMessages';

export const nextTabCommand = defineCommand({
  id: 'layout.nextTab',
  label: messageRef(layoutMessages, 'nextTab'),
  shortcut: { keys: 'Alt+PageDown' },
});

export const previousTabCommand = defineCommand({
  id: 'layout.previousTab',
  label: messageRef(layoutMessages, 'previousTab'),
  shortcut: { keys: 'Alt+PageUp' },
});

export const maximizeTabCommand = defineCommand<WindowTabTarget>({
  id: 'windowTab.maximize',
  label: messageRef(commonMessages, 'maximize'),
  icon: frameworkIcons.maximize,
});

export const closeTabCommand = defineCommand<WindowTabTarget>({
  id: 'windowTab.close',
  label: messageRef(layoutMessages, 'closeTab'),
  icon: frameworkIcons.close,
});

const MAXIMIZE_ORDER = 0;
const CLOSE_TAB_ORDER = 10;

export function registerWindowCommands({
  commands,
  contextMenus,
  workspace,
}: EditorRegistries): Unsubscribe {
  return combineUnsubscribes(
    commands.handle(nextTabCommand, {
      run: () => {
        workspace.activateAdjacentTab(1);
      },
      isEnabled: () => workspace.getActiveWindow() !== null,
    }),
    commands.handle(previousTabCommand, {
      run: () => {
        workspace.activateAdjacentTab(-1);
      },
      isEnabled: () => workspace.getActiveWindow() !== null,
    }),
    commands.handle(maximizeTabCommand, {
      run: ({ target }) => {
        if (workspace.isMaximized()) {
          workspace.restore();
        } else {
          workspace.maximize(target.windowId);
        }
      },
      isChecked: () => workspace.isMaximized(),
    }),
    commands.handle(closeTabCommand, {
      run: ({ target }) => {
        workspace.close(target.windowId);
      },
    }),
    contextMenus.registerItem(windowTabMenu, {
      path: 'maximize',
      command: maximizeTabCommand,
      group: WINDOW_TAB_MENU_FRAMEWORK_GROUP,
      order: MAXIMIZE_ORDER,
    }),
    contextMenus.registerItem(windowTabMenu, {
      path: 'close-tab',
      command: closeTabCommand,
      group: WINDOW_TAB_MENU_FRAMEWORK_GROUP,
      order: CLOSE_TAB_ORDER,
    }),
  );
}
