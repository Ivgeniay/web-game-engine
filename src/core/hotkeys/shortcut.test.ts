import { describe, expect, it } from 'vitest';
import { KEY_CODES, parseShortcut } from './shortcut';

describe('parseShortcut', () => {
  it('reads a key without modifiers', () => {
    expect(parseShortcut('F2')).toEqual({ code: 'F2', mod: false, alt: false, shift: false });
  });

  it('reads every modifier', () => {
    expect(parseShortcut('Mod+Alt+Shift+KeyS')).toEqual({
      code: 'KeyS',
      mod: true,
      alt: true,
      shift: true,
    });
  });

  it('reads a single modifier', () => {
    expect(parseShortcut('Shift+Space')).toEqual({
      code: 'Space',
      mod: false,
      alt: false,
      shift: true,
    });
  });

  it.each(KEY_CODES)('accepts the %s key', (code) => {
    expect(parseShortcut(`Mod+${code}`)?.code).toBe(code);
  });

  it.each([
    ['an empty string', ''],
    ['an unknown key', 'Mod+KeyÄ'],
    ['a character instead of a key code', 'Mod+S'],
    ['modifiers out of order', 'Shift+Mod+KeyS'],
    ['a repeated modifier', 'Mod+Mod+KeyS'],
    ['an unknown modifier', 'Ctrl+KeyS'],
    ['a modifier without a key', 'Mod+'],
    ['two keys', 'KeyA+KeyB'],
    ['spaces around the separator', 'Mod + KeyS'],
  ])('rejects %s', (_case, keys) => {
    expect(parseShortcut(keys)).toBeNull();
  });
});
