import { describe, expect, it } from 'vitest';
import { defineCommand } from '@/core/commands/command';
import type { CommandDefinition } from '@/core/commands/command';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { GLOBAL_HOTKEY_SCOPE, createKeymap } from './keymap';
import { RESERVED_SHORTCUTS, isReservedShortcut } from './reservedShortcuts';
import { parseShortcut } from './shortcut';
import type { CommandShortcut } from './shortcut';

const messages = defineMessages({
  en: { command: 'Command' },
  ru: { command: 'Команда' },
});

function command(id: string, shortcut?: CommandShortcut): CommandDefinition {
  return defineCommand({ id, label: messageRef(messages, 'command'), shortcut });
}

describe('createKeymap', () => {
  it('puts commands without a scope into the global scope', () => {
    const save = command('scene.save', { keys: 'Mod+KeyS' });

    expect(createKeymap([save]).get(GLOBAL_HOTKEY_SCOPE)).toEqual([
      {
        command: save,
        keys: 'Mod+KeyS',
        shortcut: { code: 'KeyS', mod: true, alt: false, shift: false },
        scope: GLOBAL_HOTKEY_SCOPE,
        allowInTextInput: false,
      },
    ]);
  });

  it('groups commands by scope and keeps the text input permission', () => {
    const rename = command('hierarchy.rename', { keys: 'F2', scope: 'hierarchy' });
    const run = command('console.run', { keys: 'Mod+Enter', allowInTextInput: true });

    const keymap = createKeymap([rename, run]);

    expect(keymap.get('hierarchy')?.map((binding) => binding.command)).toEqual([rename]);
    expect(keymap.get(GLOBAL_HOTKEY_SCOPE)?.[0]?.allowInTextInput).toBe(true);
  });

  it('skips commands without a shortcut', () => {
    expect(createKeymap([command('scene.close')]).size).toBe(0);
  });

  it('allows the same shortcut in different scopes', () => {
    const keymap = createKeymap([
      command('scene.delete', { keys: 'Delete' }),
      command('hierarchy.delete', { keys: 'Delete', scope: 'hierarchy' }),
    ]);

    expect(keymap.get(GLOBAL_HOTKEY_SCOPE)).toHaveLength(1);
    expect(keymap.get('hierarchy')).toHaveLength(1);
  });

  it('throws on two commands with one shortcut in one scope in development', () => {
    const commands = [
      command('hierarchy.rename', { keys: 'F2', scope: 'hierarchy' }),
      command('hierarchy.edit', { keys: 'F2', scope: 'hierarchy' }),
    ];

    expect(() => createKeymap(commands)).toThrow(
      'Shortcut F2 in scope "hierarchy" is assigned to both "hierarchy.rename" and "hierarchy.edit".',
    );
  });

  it.each(RESERVED_SHORTCUTS.map(({ keys }) => keys))(
    'throws on the reserved shortcut %s in development',
    (keys) => {
      expect(() => createKeymap([command('window.close', { keys })])).toThrow(
        `Shortcut ${keys} of command "window.close" is reserved`,
      );
    },
  );
});

describe('RESERVED_SHORTCUTS', () => {
  it('lists every shortcut once in the canonical form', () => {
    const keys = RESERVED_SHORTCUTS.map((shortcut) => shortcut.keys);

    expect(new Set(keys).size).toBe(keys.length);
    expect(keys.filter((shortcut) => parseShortcut(shortcut) === null)).toEqual([]);
  });

  it.each(['Mod+KeyW', 'Mod+Tab', 'Mod+KeyN', 'Mod+KeyT'] as const)(
    'reserves %s, which browsers keep for themselves',
    (keys) => {
      expect(isReservedShortcut(keys)).toBe(true);
    },
  );

  it.each(['Mod+KeyS', 'Mod+KeyZ', 'Mod+Shift+KeyZ', 'F2', 'Delete', 'Shift+Space'] as const)(
    'leaves %s to the editor',
    (keys) => {
      expect(isReservedShortcut(keys)).toBe(false);
    },
  );
});
