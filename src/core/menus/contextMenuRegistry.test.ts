import { describe, expect, it, vi } from 'vitest';
import { defineCommand } from '@/core/commands/command';
import { createCommandRegistry } from '@/core/commands/commandRegistry';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { createContextMenuRegistry, defineContextMenu } from './contextMenuRegistry';
import type { MenuEntry } from './menuTree';

const messages = defineMessages({
  en: { object: 'Object', tab: 'Tab', rename: 'Rename', paste: 'Paste', create: 'Create' },
  ru: {
    object: 'Объект',
    tab: 'Вкладка',
    rename: 'Переименовать',
    paste: 'Вставить',
    create: 'Создать',
  },
});

interface SceneObject {
  readonly name: string;
}

const objectMenu = defineContextMenu<SceneObject>({
  id: 'hierarchy.item',
  label: messageRef(messages, 'object'),
});
const tabMenu = defineContextMenu<string>({ id: 'window.tab', label: messageRef(messages, 'tab') });

const renameObject = defineCommand<SceneObject>({
  id: 'object.rename',
  label: messageRef(messages, 'rename'),
});
const paste = defineCommand({ id: 'edit.paste', label: messageRef(messages, 'paste') });

const CUBE: SceneObject = { name: 'Cube' };

function execute(entry: MenuEntry<SceneObject> | undefined, target: SceneObject) {
  const commands = createCommandRegistry();
  const runRename = vi.fn();
  const runPaste = vi.fn();
  commands.handle(renameObject, { run: runRename });
  commands.handle(paste, { run: runPaste });

  if (entry?.kind === 'command') {
    entry.binding.execute(commands, 'context-menu', target);
  }

  return { runRename, runPaste };
}

describe('createContextMenuRegistry', () => {
  it('keeps the entries of each context apart', () => {
    const registry = createContextMenuRegistry();
    registry.registerItem(objectMenu, {
      path: 'rename',
      command: renameObject,
      group: 0,
      order: 0,
    });
    registry.registerMenu(tabMenu, {
      path: 'create',
      label: messageRef(messages, 'create'),
      group: 0,
      order: 0,
    });

    expect(registry.getEntries(objectMenu).map((entry) => entry.path)).toEqual(['rename']);
    expect(registry.getEntries(tabMenu).map((entry) => entry.path)).toEqual(['create']);
  });

  it('allows the same path in different contexts', () => {
    const registry = createContextMenuRegistry();
    const item = {
      path: 'paste',
      command: paste,
      withoutTarget: true,
      group: 0,
      order: 0,
    } as const;

    registry.registerItem(objectMenu, item);
    registry.registerItem(tabMenu, item);

    expect(registry.getEntries(tabMenu)).toHaveLength(1);
  });

  it('passes the target to a command of the context target type', () => {
    const registry = createContextMenuRegistry();
    registry.registerItem(objectMenu, {
      path: 'rename',
      command: renameObject,
      group: 0,
      order: 0,
    });

    const { runRename } = execute(registry.getEntries(objectMenu)[0], CUBE);

    expect(runRename).toHaveBeenCalledWith({ source: 'context-menu', target: CUBE });
  });

  it('runs a command without a target without the target', () => {
    const registry = createContextMenuRegistry();
    registry.registerItem(objectMenu, {
      path: 'paste',
      command: paste,
      withoutTarget: true,
      group: 0,
      order: 0,
    });

    const { runPaste } = execute(registry.getEntries(objectMenu)[0], CUBE);

    expect(runPaste).toHaveBeenCalledWith({ source: 'context-menu', target: undefined });
  });

  it('changes the version and notifies subscribers on changes', () => {
    const registry = createContextMenuRegistry();
    const listener = vi.fn();
    registry.subscribe(listener);
    const version = registry.getVersion();

    registry.registerItem(objectMenu, {
      path: 'rename',
      command: renameObject,
      group: 0,
      order: 0,
    })();

    expect(registry.getVersion()).not.toBe(version);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('throws on a duplicate path in one context in development', () => {
    const registry = createContextMenuRegistry();
    const item = { path: 'rename', command: renameObject, group: 0, order: 0 };
    registry.registerItem(objectMenu, item);

    expect(() => registry.registerItem(objectMenu, item)).toThrow(
      'Duplicate context menu path id "hierarchy.item::rename".',
    );
  });

  it('throws on an invalid path in development', () => {
    const registry = createContextMenuRegistry();

    expect(() =>
      registry.registerItem(objectMenu, { path: '', command: renameObject, group: 0, order: 0 }),
    ).toThrow('Invalid context menu path "" in "hierarchy.item".');
  });
});
