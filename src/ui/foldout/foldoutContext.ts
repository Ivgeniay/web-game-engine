import { createContext } from 'react';
import type { FoldoutBroadcast } from './foldoutBroadcast';

export const FoldoutContext = createContext<FoldoutBroadcast | null>(null);
