import { createCommandRegistry } from '@/core/commands/commandRegistry';
import type { CommandRegistry } from '@/core/commands/commandRegistry';
import { createContextMenuRegistry } from '@/core/menus/contextMenuRegistry';
import type { ContextMenuRegistry } from '@/core/menus/contextMenuRegistry';
import { createMainMenuRegistry } from '@/core/menus/mainMenuRegistry';
import type { MainMenuRegistry } from '@/core/menus/mainMenuRegistry';
import { createStatusBarRegistry } from '@/core/statusBar/statusBarRegistry';
import type { StatusBarRegistry } from '@/core/statusBar/statusBarRegistry';
import { createToolbarRegistry } from '@/core/toolbar/toolbarRegistry';
import type { ToolbarRegistry } from '@/core/toolbar/toolbarRegistry';
import { createConfirmDialogs } from '@/state/dialogs/confirmDialogStore';
import type { ConfirmDialogs } from '@/state/dialogs/confirmDialogStore';

export interface EditorRegistries {
  readonly commands: CommandRegistry;
  readonly mainMenu: MainMenuRegistry;
  readonly contextMenus: ContextMenuRegistry;
  readonly toolbar: ToolbarRegistry;
  readonly statusBar: StatusBarRegistry;
  readonly dialogs: ConfirmDialogs;
}

export function createEditorRegistries(): EditorRegistries {
  return {
    commands: createCommandRegistry(),
    mainMenu: createMainMenuRegistry(),
    contextMenus: createContextMenuRegistry(),
    toolbar: createToolbarRegistry(),
    statusBar: createStatusBarRegistry(),
    dialogs: createConfirmDialogs(),
  };
}
