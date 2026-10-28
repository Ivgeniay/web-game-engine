import { createContext, useContext } from 'react';
import type { Platform } from '@/core/hotkeys/platform';

export const PlatformContext = createContext<Platform | null>(null);

export function usePlatform(): Platform {
  const platform = useContext(PlatformContext);

  if (platform === null) {
    throw new Error('Platform is not provided. Wrap the tree in PlatformProvider.');
  }

  return platform;
}
