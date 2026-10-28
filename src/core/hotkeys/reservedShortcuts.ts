import type { Platform } from './platform';
import type { ShortcutKeys } from './shortcut';

export interface ReservedShortcut {
  readonly keys: ShortcutKeys;
  readonly platforms: readonly Platform[];
}

const ALL_PLATFORMS: readonly Platform[] = ['mac', 'other'];
const MAC_ONLY: readonly Platform[] = ['mac'];
const OTHER_ONLY: readonly Platform[] = ['other'];

export const RESERVED_SHORTCUTS: readonly ReservedShortcut[] = [
  { keys: 'Mod+KeyN', platforms: ALL_PLATFORMS },
  { keys: 'Mod+KeyT', platforms: ALL_PLATFORMS },
  { keys: 'Mod+KeyW', platforms: ALL_PLATFORMS },
  { keys: 'Mod+Shift+KeyN', platforms: ALL_PLATFORMS },
  { keys: 'Mod+Shift+KeyT', platforms: ALL_PLATFORMS },
  { keys: 'Mod+Shift+KeyW', platforms: ALL_PLATFORMS },
  { keys: 'Mod+Tab', platforms: ALL_PLATFORMS },
  { keys: 'Mod+Shift+Tab', platforms: ALL_PLATFORMS },
  { keys: 'Mod+Digit1', platforms: ALL_PLATFORMS },
  { keys: 'Mod+Digit2', platforms: ALL_PLATFORMS },
  { keys: 'Mod+Digit3', platforms: ALL_PLATFORMS },
  { keys: 'Mod+Digit4', platforms: ALL_PLATFORMS },
  { keys: 'Mod+Digit5', platforms: ALL_PLATFORMS },
  { keys: 'Mod+Digit6', platforms: ALL_PLATFORMS },
  { keys: 'Mod+Digit7', platforms: ALL_PLATFORMS },
  { keys: 'Mod+Digit8', platforms: ALL_PLATFORMS },
  { keys: 'Mod+Digit9', platforms: ALL_PLATFORMS },
  { keys: 'Mod+KeyQ', platforms: MAC_ONLY },
  { keys: 'Mod+KeyH', platforms: MAC_ONLY },
  { keys: 'Mod+KeyM', platforms: MAC_ONLY },
  { keys: 'Mod+Space', platforms: MAC_ONLY },
  { keys: 'Mod+Backquote', platforms: MAC_ONLY },
  { keys: 'Mod+Shift+Digit3', platforms: MAC_ONLY },
  { keys: 'Mod+Shift+Digit4', platforms: MAC_ONLY },
  { keys: 'Mod+Shift+Digit5', platforms: MAC_ONLY },
  { keys: 'Mod+PageUp', platforms: OTHER_ONLY },
  { keys: 'Mod+PageDown', platforms: OTHER_ONLY },
  { keys: 'Alt+F4', platforms: OTHER_ONLY },
  { keys: 'Alt+Tab', platforms: OTHER_ONLY },
  { keys: 'Alt+Shift+Tab', platforms: OTHER_ONLY },
];

const reservedKeys: ReadonlySet<ShortcutKeys> = new Set(RESERVED_SHORTCUTS.map(({ keys }) => keys));

export function isReservedShortcut(keys: ShortcutKeys): boolean {
  return reservedKeys.has(keys);
}
