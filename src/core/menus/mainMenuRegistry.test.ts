import { describe, expect, it, vi } from 'vitest';
import { defineCommand } from '@/core/commands/command';
import { createCommandRegistry } from '@/core/commands/commandRegistry';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { createMainMenuRegistry } from './mainMenuRegistry';

const messages = defineMessages({
  en: { file: 'File', save: 'Save' },
  ru: { file: 'Файл', save: 'Сохранить' },
});

const saveScene = defineCommand({ id: 'scene.save', label: messageRef(messages, 'save') });
const FILE_MENU = { path: 'file', label: messageRef(messages, 'file'), group: 0, order: 0 };

describe('createMainMenuRegistry', () => {
  it('keeps menus and items in registration order', () => {
    const registry = createMainMenuRegistry();
    registry.registerItem({ path: 'file/save', command: saveScene, group: 0, order: 0 });
    registry.registerMenu(FILE_MENU);

    expect(registry.getEntries().map((entry) => [entry.kind, entry.path])).toEqual([
      ['command', 'file/save'],
      ['submenu', 'file'],
    ]);
  });

  it('binds an item to its command without a target', () => {
    const registry = createMainMenuRegistry();
    const commands = createCommandRegistry();
    const run = vi.fn();
    commands.handle(saveScene, { run });
    registry.registerItem({ path: 'file/save', command: saveScene, group: 0, order: 0 });
    const [entry] = registry.getEntries();

    expect(entry?.kind === 'command' && entry.binding.execute(commands, 'menu', undefined)).toBe(
      true,
    );
    expect(run).toHaveBeenCalledWith({ source: 'menu', target: undefined });
  });

  it('removes an entry when its registration is cancelled', () => {
    const registry = createMainMenuRegistry();
    const listener = vi.fn();
    registry.subscribe(listener);

    registry.registerMenu(FILE_MENU)();

    expect(registry.getEntries()).toEqual([]);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('throws on a duplicate path in development', () => {
    const registry = createMainMenuRegistry();
    registry.registerMenu(FILE_MENU);

    expect(() => registry.registerMenu(FILE_MENU)).toThrow('Duplicate main menu path id "file".');
  });

  it('throws on an invalid path in development', () => {
    const registry = createMainMenuRegistry();

    expect(() => registry.registerMenu({ ...FILE_MENU, path: 'file/' })).toThrow(
      'Invalid main menu path "file/".',
    );
  });

  it('throws on an item without a parent menu in development', () => {
    const registry = createMainMenuRegistry();

    expect(() =>
      registry.registerItem({ path: 'save', command: saveScene, group: 0, order: 0 }),
    ).toThrow('Main menu item "save" needs a parent menu');
  });
});
