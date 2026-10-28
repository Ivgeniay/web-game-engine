import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { Platform } from '@/core/hotkeys/platform';
import { PlatformProvider } from './PlatformProvider';
import { useFormatShortcut } from './useFormatShortcut';

function wrapperFor(platform: Platform) {
  return function Wrapper({ children }: { readonly children: ReactNode }) {
    return <PlatformProvider platform={platform}>{children}</PlatformProvider>;
  };
}

describe('useFormatShortcut', () => {
  it.each([
    ['mac', '⇧⌘S'],
    ['other', 'Ctrl+Shift+S'],
  ] as const)('formats for the provided %s platform', (platform, expected) => {
    const { result } = renderHook(() => useFormatShortcut(), { wrapper: wrapperFor(platform) });

    expect(result.current('Mod+Shift+KeyS')).toBe(expected);
  });

  it('throws without a provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => renderHook(() => useFormatShortcut())).toThrow('Platform is not provided.');

    vi.restoreAllMocks();
  });
});
