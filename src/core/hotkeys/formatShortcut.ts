import type { Platform } from './platform';
import { parseShortcutKeys } from './shortcut';
import type { KeyCode, ParsedShortcut, ShortcutKeys } from './shortcut';

type KeyLabel = Readonly<Record<Platform, string>>;

type NamedKeyCode = Exclude<KeyCode, `Key${string}` | `Digit${string}` | `F${number}`>;

const NAMED_KEY_LABELS: Readonly<Record<NamedKeyCode, KeyLabel>> = {
  ArrowUp: { mac: '↑', other: '↑' },
  ArrowDown: { mac: '↓', other: '↓' },
  ArrowLeft: { mac: '←', other: '←' },
  ArrowRight: { mac: '→', other: '→' },
  Home: { mac: '↖', other: 'Home' },
  End: { mac: '↘', other: 'End' },
  PageUp: { mac: '⇞', other: 'PgUp' },
  PageDown: { mac: '⇟', other: 'PgDn' },
  Enter: { mac: '↩', other: 'Enter' },
  Escape: { mac: '⎋', other: 'Esc' },
  Space: { mac: 'Space', other: 'Space' },
  Tab: { mac: '⇥', other: 'Tab' },
  Backspace: { mac: '⌫', other: 'Backspace' },
  Delete: { mac: '⌦', other: 'Delete' },
  Insert: { mac: 'Insert', other: 'Insert' },
  Minus: { mac: '-', other: '-' },
  Equal: { mac: '=', other: '=' },
  BracketLeft: { mac: '[', other: '[' },
  BracketRight: { mac: ']', other: ']' },
  Backslash: { mac: '\\', other: '\\' },
  Semicolon: { mac: ';', other: ';' },
  Quote: { mac: "'", other: "'" },
  Comma: { mac: ',', other: ',' },
  Period: { mac: '.', other: '.' },
  Slash: { mac: '/', other: '/' },
  Backquote: { mac: '`', other: '`' },
};

const MOD_LABELS: KeyLabel = { mac: '⌘', other: 'Ctrl' };
const ALT_LABELS: KeyLabel = { mac: '⌥', other: 'Alt' };
const SHIFT_LABELS: KeyLabel = { mac: '⇧', other: 'Shift' };
const KEY_SEPARATORS: KeyLabel = { mac: '', other: '+' };

const CHARACTER_KEY_PREFIX = /^(Key|Digit)/;

function isNamedKeyCode(code: KeyCode): code is NamedKeyCode {
  return Object.hasOwn(NAMED_KEY_LABELS, code);
}

function keyLabel(code: KeyCode, platform: Platform): string {
  return isNamedKeyCode(code)
    ? NAMED_KEY_LABELS[code][platform]
    : code.replace(CHARACTER_KEY_PREFIX, '');
}

function modifierLabels({ mod, alt, shift }: ParsedShortcut, platform: Platform): string[] {
  const pressed: readonly [boolean, KeyLabel][] =
    platform === 'mac'
      ? [
          [alt, ALT_LABELS],
          [shift, SHIFT_LABELS],
          [mod, MOD_LABELS],
        ]
      : [
          [mod, MOD_LABELS],
          [alt, ALT_LABELS],
          [shift, SHIFT_LABELS],
        ];

  return pressed.filter(([isPressed]) => isPressed).map(([, labels]) => labels[platform]);
}

export function formatShortcut(keys: ShortcutKeys, platform: Platform): string {
  const shortcut = parseShortcutKeys(keys);

  return [...modifierLabels(shortcut, platform), keyLabel(shortcut.code, platform)].join(
    KEY_SEPARATORS[platform],
  );
}
