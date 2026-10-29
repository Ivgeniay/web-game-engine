import { useContext } from 'react';
import { MacPlatformContext } from './macPlatformContext';

export function useIsMacPlatform(): boolean {
  return useContext(MacPlatformContext);
}
