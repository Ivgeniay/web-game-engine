import type { ReactNode } from 'react';
import type { Platform } from '@/core/hotkeys/platform';
import { MacPlatformContext } from '@/ui/platform/macPlatformContext';
import { PlatformContext } from './platformContext';

interface PlatformProviderProps {
  readonly platform: Platform;
  readonly children: ReactNode;
}

export function PlatformProvider({ platform, children }: PlatformProviderProps) {
  return (
    <PlatformContext value={platform}>
      <MacPlatformContext value={platform === 'mac'}>{children}</MacPlatformContext>
    </PlatformContext>
  );
}
