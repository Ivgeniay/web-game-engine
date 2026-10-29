import { useEffect, useId, useRef, useSyncExternalStore } from 'react';
import { DROP_TARGET_ATTRIBUTE, useDragAndDropManager } from './dragAndDropContext';
import type { DropTargetHandlers } from './dragData';

export interface DropTargetOptions extends DropTargetHandlers {
  readonly enabled?: boolean | undefined;
}

export interface DropTargetProps {
  readonly [DROP_TARGET_ATTRIBUTE]?: string;
}

export interface DropTarget {
  readonly dropTargetProps: DropTargetProps;
  readonly isOver: boolean;
}

const NO_PROPS: DropTargetProps = {};

function subscribeToNothing(): () => void {
  return () => undefined;
}

function isNotOverOnServer(): boolean {
  return false;
}

export function useDropTarget(options: DropTargetOptions): DropTarget {
  const enabled = options.enabled ?? true;
  const manager = useDragAndDropManager(enabled);
  const id = useId();
  const handlersRef = useRef<DropTargetHandlers>(options);

  useEffect(() => {
    handlersRef.current = options;
  });

  useEffect(() => {
    if (!enabled || manager === null) {
      return undefined;
    }

    return manager.registerTarget(id, () => handlersRef.current);
  }, [manager, id, enabled]);

  const isOver = useSyncExternalStore(
    manager?.subscribe ?? subscribeToNothing,
    () => {
      const session = manager?.getSession() ?? null;

      return enabled && session?.targetId === id && session.allowed;
    },
    isNotOverOnServer,
  );

  return { dropTargetProps: enabled ? { [DROP_TARGET_ATTRIBUTE]: id } : NO_PROPS, isOver };
}
