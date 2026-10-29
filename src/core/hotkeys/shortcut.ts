export const KEY_CODES = [
  'KeyA',
  'KeyB',
  'KeyC',
  'KeyD',
  'KeyE',
  'KeyF',
  'KeyG',
  'KeyH',
  'KeyI',
  'KeyJ',
  'KeyK',
  'KeyL',
  'KeyM',
  'KeyN',
  'KeyO',
  'KeyP',
  'KeyQ',
  'KeyR',
  'KeyS',
  'KeyT',
  'KeyU',
  'KeyV',
  'KeyW',
  'KeyX',
  'KeyY',
  'KeyZ',
  'Digit0',
  'Digit1',
  'Digit2',
  'Digit3',
  'Digit4',
  'Digit5',
  'Digit6',
  'Digit7',
  'Digit8',
  'Digit9',
  'F1',
  'F2',
  'F3',
  'F4',
  'F5',
  'F6',
  'F7',
  'F8',
  'F9',
  'F10',
  'F11',
  'F12',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'PageUp',
  'PageDown',
  'Enter',
  'Escape',
  'Space',
  'Tab',
  'Backspace',
  'Delete',
  'Insert',
  'Minus',
  'Equal',
  'BracketLeft',
  'BracketRight',
  'Backslash',
  'Semicolon',
  'Quote',
  'Comma',
  'Period',
  'Slash',
  'Backquote',
] as const;

export type KeyCode = (typeof KEY_CODES)[number];

type ModifierPrefix =
  '' | 'Mod+' | 'Alt+' | 'Shift+' | 'Mod+Alt+' | 'Mod+Shift+' | 'Alt+Shift+' | 'Mod+Alt+Shift+';

export type ShortcutKeys = `${ModifierPrefix}${KeyCode}`;

export type TextInputPolicy = boolean | 'whenCommitted';

export interface CommandShortcut {
  readonly keys: ShortcutKeys;
  readonly scope?: string | undefined;
  readonly allowInTextInput?: TextInputPolicy | undefined;
}

export interface ParsedShortcut {
  readonly code: KeyCode;
  readonly mod: boolean;
  readonly alt: boolean;
  readonly shift: boolean;
}

const KEY_SEPARATOR = '+';

const keyCodes = new Set<string>(KEY_CODES);

function isKeyCode(value: string): value is KeyCode {
  return keyCodes.has(value);
}

function formatKeys({ code, mod, alt, shift }: ParsedShortcut): ShortcutKeys {
  const prefix: ModifierPrefix = `${mod ? 'Mod+' : ''}${alt ? 'Alt+' : ''}${shift ? 'Shift+' : ''}`;

  return `${prefix}${code}`;
}

export function parseShortcut(keys: string): ParsedShortcut | null {
  const parts = keys.split(KEY_SEPARATOR);
  const code = parts.at(-1);

  if (code === undefined || !isKeyCode(code)) {
    return null;
  }

  const modifiers = new Set(parts.slice(0, -1));
  const parsed: ParsedShortcut = {
    code,
    mod: modifiers.has('Mod'),
    alt: modifiers.has('Alt'),
    shift: modifiers.has('Shift'),
  };

  return formatKeys(parsed) === keys ? parsed : null;
}

export function parseShortcutKeys(keys: ShortcutKeys): ParsedShortcut {
  const parsed = parseShortcut(keys);

  if (parsed === null) {
    throw new Error(`Invalid shortcut "${keys}".`);
  }

  return parsed;
}
