import type { CommandDefinition } from '@/core/commands/command';
import { reportDevelopmentError } from '@/shared/developmentError';
import { createRegistry } from '@/core/registry/registry';
import type { Unsubscribe } from '@/core/unsubscribe';
import { MENU_ROOT_PATH, commandBinding, isValidMenuPath, parentMenuPath } from './menuTree';
import type { MenuEntry, MenuPlacement, MenuSubmenuRegistration } from './menuTree';

export interface MainMenuItemRegistration extends MenuPlacement {
  readonly path: string;
  readonly command: CommandDefinition;
}

export interface MainMenuRegistry {
  readonly registerMenu: (menu: MenuSubmenuRegistration) => Unsubscribe;
  readonly registerItem: (item: MainMenuItemRegistration) => Unsubscribe;
  readonly getEntries: () => readonly MenuEntry<undefined>[];
  readonly subscribe: (listener: () => void) => Unsubscribe;
}

function ignoreUnsubscribe(): void {}

export function createMainMenuRegistry(): MainMenuRegistry {
  const entries = createRegistry<MenuEntry<undefined>>({
    kind: 'main menu path',
    getId: (entry) => entry.path,
  });

  function register(entry: MenuEntry<undefined>): Unsubscribe {
    if (!isValidMenuPath(entry.path)) {
      reportDevelopmentError(`Invalid main menu path "${entry.path}".`);
      return ignoreUnsubscribe;
    }

    return entries.register(entry);
  }

  return {
    registerMenu: (menu) => register({ ...menu, kind: 'submenu' }),
    registerItem({ path, command, group, order }) {
      if (parentMenuPath(path) === MENU_ROOT_PATH) {
        reportDevelopmentError(
          `Main menu item "${path}" needs a parent menu: register it as "menu/${path}".`,
        );
        return ignoreUnsubscribe;
      }

      return register({ kind: 'command', path, group, order, binding: commandBinding(command) });
    },
    getEntries: entries.getSnapshot,
    subscribe: entries.subscribe,
  };
}
