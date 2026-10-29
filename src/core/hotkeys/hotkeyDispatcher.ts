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
  readonly inCommittedValueField: boolean;
  readonly onKeyActivatedElement: boolean;
  readonly globalBlocked: boolean;
}

const LETTER_CODE_PREFIX = 'Key';
const LATIN_LETTER_PATTERN = /^[a-z]$/i;
const FUNCTION_KEY_PATTERN = /^F\d+$/;
const ELEMENT_ACTIVATION_CODES: ReadonlySet<string> = new Set(['Space', 'Enter']);

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

function allowsTextInput(binding: KeyBinding, context: HotkeyContext): boolean {
  return binding.allowInTextInput === 'whenCommitted'
    ? context.inCommittedValueField
    : binding.allowInTextInput;
}

function worksInTextInput(binding: KeyBinding, context: HotkeyContext): boolean {
  const { mod, alt, code } = binding.shortcut;

  return allowsTextInput(binding, context) && (mod || alt || FUNCTION_KEY_PATTERN.test(code));
}

function worksInContext(binding: KeyBinding, context: HotkeyContext): boolean {
  if (context.onKeyActivatedElement && ELEMENT_ACTIVATION_CODES.has(binding.shortcut.code)) {
    return false;
  }

  return !context.inTextInput || worksInTextInput(binding, context);
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
        worksInContext(binding, context) && matchesShortcut(event, binding.shortcut, platform),
    ),
  );
}
