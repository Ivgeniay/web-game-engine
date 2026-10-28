import { describe, expect, it } from 'vitest';
import { defineCommand } from '@/core/commands/command';
import type { CommandDefinition } from '@/core/commands/command';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { findHotkeyBindings, matchesShortcut } from './hotkeyDispatcher';
import type { HotkeyContext, HotkeyKeyEvent } from './hotkeyDispatcher';
import { createKeymap } from './keymap';
import { parseShortcutKeys } from './shortcut';
import type { CommandShortcut, ShortcutKeys } from './shortcut';

const NO_MODIFIERS = { ctrlKey: false, metaKey: false, altKey: false, shiftKey: false };

function press(key: string, code: string, modifiers: Partial<HotkeyKeyEvent> = {}): HotkeyKeyEvent {
  return { ...NO_MODIFIERS, key, code, ...modifiers };
}

function matchesOnWindows(event: HotkeyKeyEvent, keys: ShortcutKeys): boolean {
  return matchesShortcut(event, parseShortcutKeys(keys), 'other');
}

function matchesOnMac(event: HotkeyKeyEvent, keys: ShortcutKeys): boolean {
  return matchesShortcut(event, parseShortcutKeys(keys), 'mac');
}

const CTRL = { ctrlKey: true };
const CMD = { metaKey: true };

describe('matchesShortcut', () => {
  it('maps Mod to Ctrl outside macOS and to Command on macOS', () => {
    expect(matchesOnWindows(press('s', 'KeyS', CTRL), 'Mod+KeyS')).toBe(true);
    expect(matchesOnWindows(press('s', 'KeyS', CMD), 'Mod+KeyS')).toBe(false);
    expect(matchesOnMac(press('s', 'KeyS', CMD), 'Mod+KeyS')).toBe(true);
    expect(matchesOnMac(press('s', 'KeyS', CTRL), 'Mod+KeyS')).toBe(false);
  });

  it('ignores the Control key on macOS together with Command', () => {
    expect(matchesOnMac(press('s', 'KeyS', { metaKey: true, ctrlKey: true }), 'Mod+KeyS')).toBe(
      false,
    );
  });

  it('requires exactly the modifiers of the shortcut', () => {
    expect(
      matchesOnWindows(press('S', 'KeyS', { ctrlKey: true, shiftKey: true }), 'Mod+KeyS'),
    ).toBe(false);
    expect(
      matchesOnWindows(press('S', 'KeyS', { ctrlKey: true, shiftKey: true }), 'Mod+Shift+KeyS'),
    ).toBe(true);
    expect(matchesOnWindows(press('s', 'KeyS'), 'Mod+KeyS')).toBe(false);
    expect(matchesOnWindows(press('F2', 'F2', { altKey: true }), 'F2')).toBe(false);
  });

  describe('in the Russian layout', () => {
    it('matches a letter shortcut by the physical key', () => {
      expect(matchesOnWindows(press('ы', 'KeyS', CTRL), 'Mod+KeyS')).toBe(true);
      expect(
        matchesOnWindows(press('Я', 'KeyZ', { ctrlKey: true, shiftKey: true }), 'Mod+Shift+KeyZ'),
      ).toBe(true);
      expect(matchesOnMac(press('а', 'KeyF', {}), 'KeyF')).toBe(true);
    });

    it('does not match another physical key', () => {
      expect(matchesOnWindows(press('ы', 'KeyS', CTRL), 'Mod+KeyD')).toBe(false);
    });
  });

  describe('in the AZERTY layout', () => {
    it('matches Mod+Z on the key labelled Z', () => {
      expect(matchesOnWindows(press('z', 'KeyW', CTRL), 'Mod+KeyZ')).toBe(true);
    });

    it('does not match Mod+Z on the key labelled W', () => {
      expect(matchesOnWindows(press('w', 'KeyZ', CTRL), 'Mod+KeyZ')).toBe(false);
      expect(matchesOnWindows(press('w', 'KeyZ', CTRL), 'Mod+KeyW')).toBe(true);
    });

    it('matches digits by the physical key', () => {
      expect(matchesOnWindows(press('&', 'Digit1', { altKey: true }), 'Alt+Digit1')).toBe(true);
    });
  });

  describe('in the Dvorak layout', () => {
    it('matches Mod+S on the key labelled S', () => {
      expect(matchesOnWindows(press('s', 'Semicolon', CTRL), 'Mod+KeyS')).toBe(true);
    });

    it('does not match Mod+S on the physical S key that types O', () => {
      expect(matchesOnWindows(press('o', 'KeyS', CTRL), 'Mod+KeyS')).toBe(false);
      expect(matchesOnWindows(press('o', 'KeyS', CTRL), 'Mod+KeyO')).toBe(true);
    });
  });

  it('falls back to the physical key when Option changes the character on macOS', () => {
    expect(matchesOnMac(press('ß', 'KeyS', { altKey: true }), 'Alt+KeyS')).toBe(true);
  });

  it('matches non-letter keys by the physical key', () => {
    expect(matchesOnWindows(press('Delete', 'Delete'), 'Delete')).toBe(true);
    expect(matchesOnWindows(press(' ', 'Space', { shiftKey: true }), 'Shift+Space')).toBe(true);
    expect(matchesOnWindows(press('F2', 'F2'), 'F2')).toBe(true);
  });
});

const messages = defineMessages({
  en: { command: 'Command' },
  ru: { command: 'Команда' },
});

function command(id: string, shortcut: CommandShortcut): CommandDefinition {
  return defineCommand({ id, label: messageRef(messages, 'command'), shortcut });
}

const globalDelete = command('scene.delete', { keys: 'Delete' });
const hierarchyDelete = command('hierarchy.delete', { keys: 'Delete', scope: 'hierarchy' });
const inspectorDelete = command('inspector.delete', { keys: 'Delete', scope: 'inspector' });
const save = command('scene.save', { keys: 'Mod+KeyS' });
const runLine = command('console.run', { keys: 'Mod+Enter', allowInTextInput: true });
const clearLine = command('console.clear', { keys: 'Escape', allowInTextInput: true });
const nextRegion = command('editor.nextRegion', { keys: 'F6', allowInTextInput: true });
const rename = command('hierarchy.rename', { keys: 'F2' });
const maximize = command('layout.maximize', { keys: 'Shift+Space' });
const confirmSelection = command('list.confirm', { keys: 'Enter' });
const keymap = createKeymap([
  globalDelete,
  hierarchyDelete,
  inspectorDelete,
  save,
  runLine,
  clearLine,
  nextRegion,
  rename,
  maximize,
  confirmSelection,
]);

const NOWHERE: HotkeyContext = {
  scopes: [],
  inTextInput: false,
  onKeyActivatedElement: false,
  globalBlocked: false,
};

function commandsFor(event: HotkeyKeyEvent, context: Partial<HotkeyContext>) {
  return findHotkeyBindings(keymap, event, { ...NOWHERE, ...context }, 'other').map(
    (binding) => binding.command,
  );
}

const DELETE = press('Delete', 'Delete');

describe('findHotkeyBindings', () => {
  it('finds a global binding outside any scope', () => {
    expect(commandsFor(DELETE, {})).toEqual([globalDelete]);
  });

  it('puts the narrowest scope first and the global scope last', () => {
    expect(commandsFor(DELETE, { scopes: ['inspector', 'hierarchy'] })).toEqual([
      inspectorDelete,
      hierarchyDelete,
      globalDelete,
    ]);
  });

  it('skips global bindings while they are blocked', () => {
    expect(commandsFor(DELETE, { globalBlocked: true })).toEqual([]);
    expect(commandsFor(DELETE, { globalBlocked: true, scopes: ['hierarchy'] })).toEqual([
      hierarchyDelete,
    ]);
  });

  it('skips shortcuts without modifiers in a text input', () => {
    expect(commandsFor(DELETE, { inTextInput: true, scopes: ['hierarchy'] })).toEqual([]);
  });

  it('skips shortcuts with modifiers in a text input unless they are allowed there', () => {
    expect(commandsFor(press('s', 'KeyS', CTRL), { inTextInput: true })).toEqual([]);
    expect(commandsFor(press('Enter', 'Enter', CTRL), { inTextInput: true })).toEqual([runLine]);
  });

  it('never allows shortcuts without Mod or Alt in a text input', () => {
    expect(commandsFor(press('Escape', 'Escape'), { inTextInput: true })).toEqual([]);
    expect(commandsFor(press('Escape', 'Escape'), {})).toEqual([clearLine]);
  });

  it('allows a function key without modifiers in a text input only when the command allows it', () => {
    expect(commandsFor(press('F6', 'F6'), { inTextInput: true })).toEqual([nextRegion]);
    expect(commandsFor(press('F2', 'F2'), { inTextInput: true })).toEqual([]);
  });

  it('leaves Space and Enter to an element that is activated by them', () => {
    const shiftSpace = press(' ', 'Space', { shiftKey: true });
    const enter = press('Enter', 'Enter');

    expect(commandsFor(shiftSpace, { onKeyActivatedElement: true })).toEqual([]);
    expect(commandsFor(enter, { onKeyActivatedElement: true })).toEqual([]);
    expect(commandsFor(shiftSpace, {})).toEqual([maximize]);
    expect(commandsFor(enter, {})).toEqual([confirmSelection]);
    expect(commandsFor(DELETE, { onKeyActivatedElement: true })).toEqual([globalDelete]);
  });

  it('finds nothing for an unbound key', () => {
    expect(commandsFor(press('x', 'KeyX'), {})).toEqual([]);
  });
});
