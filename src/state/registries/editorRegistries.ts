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
import { createWindowRegistry } from '@/core/windows/windowRegistry';
import type { WindowRegistry } from '@/core/windows/windowRegistry';
import { createUndoStack } from '@/core/undo/undoStack';
import type { UndoStack } from '@/core/undo/undoStack';
import { createWorkspace } from '@/core/windows/workspace';
import type { Workspace } from '@/core/windows/workspace';
import { createConfirmDialogs } from '@/state/dialogs/confirmDialogStore';
import type { ConfirmDialogs } from '@/state/dialogs/confirmDialogStore';

export interface EditorRegistries {
  readonly commands: CommandRegistry;
  readonly mainMenu: MainMenuRegistry;
  readonly contextMenus: ContextMenuRegistry;
  readonly toolbar: ToolbarRegistry;
  readonly statusBar: StatusBarRegistry;
  readonly dialogs: ConfirmDialogs;
  readonly windows: WindowRegistry;
  readonly workspace: Workspace;
  readonly undo: UndoStack;
}

export function createEditorRegistries(): EditorRegistries {
  return {
    commands: createCommandRegistry(),
    mainMenu: createMainMenuRegistry(),
    contextMenus: createContextMenuRegistry(),
    toolbar: createToolbarRegistry(),
    statusBar: createStatusBarRegistry(),
    dialogs: createConfirmDialogs(),
    windows: createWindowRegistry(),
    workspace: createWorkspace(),
    undo: createUndoStack(),
  };
}
