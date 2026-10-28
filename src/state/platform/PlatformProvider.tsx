import type { ReactNode } from 'react';
import type { Platform } from '@/core/hotkeys/platform';
import { PlatformContext } from './platformContext';

interface PlatformProviderProps {
  readonly platform: Platform;
  readonly children: ReactNode;
}

export function PlatformProvider({ platform, children }: PlatformProviderProps) {
  return <PlatformContext value={platform}>{children}</PlatformContext>;
}
