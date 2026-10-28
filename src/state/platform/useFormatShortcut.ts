import { useCallback } from 'react';
import { formatShortcut } from '@/core/hotkeys/formatShortcut';
import type { ShortcutKeys } from '@/core/hotkeys/shortcut';
import { usePlatform } from './platformContext';

export type ShortcutFormatter = (keys: ShortcutKeys) => string;

export function useFormatShortcut(): ShortcutFormatter {
  const platform = usePlatform();

  return useCallback<ShortcutFormatter>((keys) => formatShortcut(keys, platform), [platform]);
}
