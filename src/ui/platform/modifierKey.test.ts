import { describe, expect, it } from 'vitest';
import { isModPressed } from './modifierKey';

const CTRL = { ctrlKey: true, metaKey: false };
const META = { ctrlKey: false, metaKey: true };

describe('isModPressed', () => {
  it('reads Ctrl outside macOS', () => {
    expect(isModPressed(CTRL, false)).toBe(true);
    expect(isModPressed(META, false)).toBe(false);
  });

  it('reads Command on macOS', () => {
    expect(isModPressed(META, true)).toBe(true);
    expect(isModPressed(CTRL, true)).toBe(false);
  });
});
