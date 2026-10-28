import { createCommandRegistry } from '@/core/commands/commandRegistry';
import type { CommandRegistry } from '@/core/commands/commandRegistry';
import { createContextMenuRegistry } from '@/core/menus/contextMenuRegistry';
import type { ContextMenuRegistry } from '@/core/menus/contextMenuRegistry';
import { createMainMenuRegistry } from '@/core/menus/mainMenuRegistry';
import type { MainMenuRegistry } from '@/core/menus/mainMenuRegistry';

export interface EditorRegistries {
  readonly commands: CommandRegistry;
  readonly mainMenu: MainMenuRegistry;
  readonly contextMenus: ContextMenuRegistry;
}

export function createEditorRegistries(): EditorRegistries {
  return {
    commands: createCommandRegistry(),
    mainMenu: createMainMenuRegistry(),
    contextMenus: createContextMenuRegistry(),
  };
}
