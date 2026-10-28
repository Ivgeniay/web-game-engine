import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineCommand } from '@/core/commands/command';
import type { CommandDefinition } from '@/core/commands/command';
import { createCommandRegistry } from '@/core/commands/commandRegistry';
import type { CommandRegistry } from '@/core/commands/commandRegistry';
import { formatShortcut } from '@/core/hotkeys/formatShortcut';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef, translateRef } from '@/core/i18n/translate';
import { createMainMenuRegistry } from '@/core/menus/mainMenuRegistry';
import type { MainMenuRegistry } from '@/core/menus/mainMenuRegistry';
import { buildMenuTree } from '@/core/menus/menuTree';
import type { MenuItem } from '@/ui/menu/menuItems';
import { hasVisibleItems, menuItemsFromTree } from './menuItemsFromTree';

const messages = defineMessages({
  en: {
    file: 'File',
    open: 'Open',
    save: 'Save',
    export: 'Export',
    png: 'PNG',
    grid: 'Show grid',
    quit: 'Quit',
  },
  ru: {
    file: 'Файл',
    open: 'Открыть',
    save: 'Сохранить',
    export: 'Экспорт',
    png: 'PNG',
    grid: 'Показать сетку',
    quit: 'Выйти',
  },
});

const open = defineCommand({ id: 'file.open', label: messageRef(messages, 'open') });
const save = defineCommand({
  id: 'file.save',
  label: messageRef(messages, 'save'),
  shortcut: { keys: 'Mod+KeyS' },
});
const exportPng = defineCommand({ id: 'file.exportPng', label: messageRef(messages, 'png') });
const grid = defineCommand({ id: 'view.grid', label: messageRef(messages, 'grid') });
const quit = defineCommand({ id: 'app.quit', label: messageRef(messages, 'quit') });

function registerFileMenu(menu: MainMenuRegistry): void {
  menu.registerMenu({ path: 'file', label: messageRef(messages, 'file'), group: 0, order: 0 });
  menu.registerItem({ path: 'file/open', command: open, group: 0, order: 0 });
  menu.registerItem({ path: 'file/save', command: save, group: 0, order: 10 });
  menu.registerMenu({
    path: 'file/export',
    label: messageRef(messages, 'export'),
    group: 1,
    order: 0,
  });
  menu.registerItem({ path: 'file/export/png', command: exportPng, group: 0, order: 0 });
  menu.registerItem({ path: 'file/grid', command: grid, group: 2, order: 0 });
  menu.registerItem({ path: 'file/quit', command: quit, group: 9, order: 0 });
}

function handle(commands: CommandRegistry, ...definitions: CommandDefinition[]): void {
  for (const definition of definitions) {
    commands.handle(definition, { run: vi.fn() });
  }
}

function fileItems(commands: CommandRegistry, language: 'en' | 'ru' = 'en'): MenuItem[] {
  const menu = createMainMenuRegistry();
  registerFileMenu(menu);
  const file = buildMenuTree(menu.getEntries())[0]?.[0];

  if (file?.kind !== 'submenu') {
    return [];
  }

  return menuItemsFromTree(file.groups, {
    commands,
    source: 'menu',
    target: undefined,
    translate: (ref) => translateRef(ref, language),
    formatShortcut: (keys) => formatShortcut(keys, 'other'),
  });
}

function shape(items: readonly MenuItem[]): string[] {
  return items.map((item) => (item.kind === 'separator' ? '---' : item.id));
}

afterEach(() => {
  vi.useRealTimers();
});

describe('menuItemsFromTree', () => {
  it('puts separators between groups', () => {
    const commands = createCommandRegistry();
    handle(commands, open, save, exportPng, grid, quit);

    expect(shape(fileItems(commands))).toEqual([
      'file/open',
      'file/save',
      '---',
      'file/export',
      '---',
      'file/grid',
      '---',
      'file/quit',
    ]);
  });

  it('hides commands without handlers, empty submenus and empty groups', () => {
    const commands = createCommandRegistry();
    handle(commands, open, quit);

    expect(shape(fileItems(commands))).toEqual(['file/open', '---', 'file/quit']);
  });

  it('translates labels and formats shortcuts', () => {
    const commands = createCommandRegistry();
    handle(commands, save);

    expect(fileItems(commands, 'ru')).toEqual([
      expect.objectContaining({ kind: 'action', label: 'Сохранить', shortcut: 'Ctrl+S' }),
    ]);
  });

  it('shows availability and the check mark of the command', () => {
    const commands = createCommandRegistry();
    commands.handle(save, { run: vi.fn(), isEnabled: () => false });
    commands.handle(grid, { run: vi.fn(), isChecked: () => true });

    expect(fileItems(commands)).toEqual([
      expect.objectContaining({ kind: 'action', id: 'file/save', disabled: true }),
      expect.objectContaining({ kind: 'separator' }),
      expect.objectContaining({
        kind: 'checkbox',
        id: 'file/grid',
        checked: true,
        disabled: false,
      }),
    ]);
  });

  it('runs the command only after the menu has had time to close', () => {
    vi.useFakeTimers();
    const commands = createCommandRegistry();
    const run = vi.fn();
    commands.handle(open, { run });
    const [item] = fileItems(commands);

    if (item?.kind === 'action') {
      item.onSelect();
    }

    expect(run).not.toHaveBeenCalled();

    vi.runAllTimers();

    expect(run).toHaveBeenCalledWith({ source: 'menu', target: undefined });
  });
});

describe('hasVisibleItems', () => {
  it('is true only when some nested command has a handler', () => {
    const menu = createMainMenuRegistry();
    registerFileMenu(menu);
    const tree = buildMenuTree(menu.getEntries());
    const commands = createCommandRegistry();

    expect(hasVisibleItems(tree, commands)).toBe(false);

    handle(commands, exportPng);

    expect(hasVisibleItems(tree, commands)).toBe(true);
  });
});
