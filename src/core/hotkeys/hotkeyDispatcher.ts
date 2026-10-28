import { GLOBAL_HOTKEY_SCOPE } from './keymap';
import type { KeyBinding, Keymap } from './keymap';
import type { Platform } from './platform';
import type { ParsedShortcut } from './shortcut';

export interface HotkeyKeyEvent {
  readonly key: string;
  readonly code: string;
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
  readonly altKey: boolean;
  readonly shiftKey: boolean;
}

export interface HotkeyContext {
  readonly scopes: readonly string[];
  readonly inTextInput: boolean;
  readonly globalBlocked: boolean;
}

const LETTER_CODE_PREFIX = 'Key';
const LATIN_LETTER_PATTERN = /^[a-z]$/i;

function modifiersMatch(
  event: HotkeyKeyEvent,
  shortcut: ParsedShortcut,
  platform: Platform,
): boolean {
  const modKey = platform === 'mac' ? event.metaKey : event.ctrlKey;
  const otherKey = platform === 'mac' ? event.ctrlKey : event.metaKey;

  return (
    !otherKey &&
    modKey === shortcut.mod &&
    event.altKey === shortcut.alt &&
    event.shiftKey === shortcut.shift
  );
}

function keyMatches(event: HotkeyKeyEvent, shortcut: ParsedShortcut): boolean {
  const isLetterShortcut = shortcut.code.startsWith(LETTER_CODE_PREFIX);

  if (isLetterShortcut && LATIN_LETTER_PATTERN.test(event.key)) {
    return event.key.toUpperCase() === shortcut.code.slice(LETTER_CODE_PREFIX.length);
  }

  return event.code === shortcut.code;
}

export function matchesShortcut(
  event: HotkeyKeyEvent,
  shortcut: ParsedShortcut,
  platform: Platform,
): boolean {
  return modifiersMatch(event, shortcut, platform) && keyMatches(event, shortcut);
}

function worksInContext(binding: KeyBinding, inTextInput: boolean): boolean {
  if (!inTextInput) {
    return true;
  }

  const { mod, alt } = binding.shortcut;

  return binding.allowInTextInput && (mod || alt);
}

export function findHotkeyBindings(
  keymap: Keymap,
  event: HotkeyKeyEvent,
  context: HotkeyContext,
  platform: Platform,
): readonly KeyBinding[] {
  const scopes = context.globalBlocked ? context.scopes : [...context.scopes, GLOBAL_HOTKEY_SCOPE];

  return scopes.flatMap((scope) =>
    (keymap.get(scope) ?? []).filter(
      (binding) =>
        worksInContext(binding, context.inTextInput) &&
        matchesShortcut(event, binding.shortcut, platform),
    ),
  );
}
