import { createContext, useContext } from 'react';
import type { DragAndDropManager } from './dragAndDropManager';

export const DragAndDropContext = createContext<DragAndDropManager | null>(null);

export const DROP_TARGET_ATTRIBUTE = 'data-drop-target';

export function useDragAndDropManager(enabled: boolean): DragAndDropManager | null {
  const manager = useContext(DragAndDropContext);

  if (enabled && manager === null) {
    throw new Error('Drag and drop is not provided. Wrap the tree in DragAndDropLayer.');
  }

  return manager;
}
