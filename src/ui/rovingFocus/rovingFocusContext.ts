import { createContext } from 'react';
import type { RovingFocusRegistry } from './rovingFocusRegistry';

export const RovingFocusContext = createContext<RovingFocusRegistry<HTMLElement> | null>(null);
