import { useContext } from 'react';
import { MenuLevelContext } from './menuLevelContext';
import type { MenuLevelContextValue } from './menuLevelContext';

export function useMenuLevelContext(): MenuLevelContextValue {
  const level = useContext(MenuLevelContext);

  if (level === null) {
    throw new Error('Menu items must be rendered inside a menu level.');
  }

  return level;
}
