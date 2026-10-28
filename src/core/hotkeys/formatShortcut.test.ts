import { describe, expect, it } from 'vitest';
import { formatShortcut } from './formatShortcut';
import { KEY_CODES } from './shortcut';

const CODE_NAME_PATTERN = /^(Key|Digit|Arrow|Page|Bracket)|^(Escape|Equal|Minus|Quote)$/;

describe('formatShortcut', () => {
  it.each([
    ['KeyS', 'S', 'S'],
    ['Mod+KeyS', '⌘S', 'Ctrl+S'],
    ['Mod+Shift+KeyS', '⇧⌘S', 'Ctrl+Shift+S'],
    ['Mod+Alt+Shift+KeyZ', '⌥⇧⌘Z', 'Ctrl+Alt+Shift+Z'],
    ['Alt+Digit1', '⌥1', 'Alt+1'],
    ['Shift+F10', '⇧F10', 'Shift+F10'],
    ['Delete', '⌦', 'Delete'],
    ['Mod+Enter', '⌘↩', 'Ctrl+Enter'],
    ['Shift+Space', '⇧Space', 'Shift+Space'],
    ['Mod+BracketLeft', '⌘[', 'Ctrl+['],
    ['Alt+PageDown', '⌥⇟', 'Alt+PgDn'],
  ] as const)('formats %s as %s on macOS and %s elsewhere', (keys, mac, other) => {
    expect(formatShortcut(keys, 'mac')).toBe(mac);
    expect(formatShortcut(keys, 'other')).toBe(other);
  });

  it.each(KEY_CODES)('has a short label for %s', (code) => {
    expect(formatShortcut(code, 'mac')).not.toMatch(CODE_NAME_PATTERN);
    expect(formatShortcut(code, 'other')).not.toMatch(CODE_NAME_PATTERN);
  });
});
