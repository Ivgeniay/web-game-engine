import type { DragData } from '@/contracts/dragData';
import type { DragPoint, DragSession, DropTargetHandlers } from './dragData';

export type FindDropTarget = (point: DragPoint) => string | null;

export interface DragAndDropManager {
  readonly registerTarget: (id: string, getHandlers: () => DropTargetHandlers) => () => void;
  readonly start: (data: DragData, point: DragPoint) => void;
  readonly move: (point: DragPoint) => void;
  readonly refresh: () => void;
  readonly drop: () => void;
  readonly cancel: () => void;
  readonly getSession: () => DragSession | null;
  readonly subscribe: (listener: () => void) => () => void;
}

export function createDragAndDropManager(findTarget: FindDropTarget): DragAndDropManager {
  const targets = new Map<string, () => DropTargetHandlers>();
  const listeners = new Set<() => void>();
  let session: DragSession | null = null;

  function notify(): void {
    for (const listener of listeners) {
      listener();
    }
  }

  function handlersOf(id: string | null): DropTargetHandlers | undefined {
    return id === null ? undefined : targets.get(id)?.();
  }

  function leave(id: string | null): void {
    handlersOf(id)?.onDragLeave?.();
  }

  function update(data: DragData, point: DragPoint, previousTargetId: string | null): void {
    const targetId = findTarget(point);

    if (targetId !== previousTargetId) {
      leave(previousTargetId);
    }

    const handlers = handlersOf(targetId);
    const allowed =
      handlers !== undefined && handlers.accepts.includes(data.type)
        ? handlers.onDragOver(data, point)
        : false;

    session = { data, point, targetId: handlers === undefined ? null : targetId, allowed };
    notify();
  }

  function finish(): void {
    session = null;
    notify();
  }

  return {
    registerTarget(id, getHandlers) {
      targets.set(id, getHandlers);

      return () => {
        if (targets.get(id) === getHandlers) {
          targets.delete(id);
        }
        if (session?.targetId === id) {
          session = { ...session, targetId: null, allowed: false };
          notify();
        }
      };
    },
    start(data, point) {
      leave(session?.targetId ?? null);
      update(data, point, null);
    },
    move(point) {
      if (session !== null) {
        update(session.data, point, session.targetId);
      }
    },
    refresh() {
      if (session !== null) {
        update(session.data, session.point, session.targetId);
      }
    },
    drop() {
      if (session === null) {
        return;
      }

      const { data, point, targetId, allowed } = session;
      const handlers = handlersOf(targetId);

      if (allowed && handlers !== undefined) {
        handlers.onDrop(data, point);
      }

      leave(targetId);
      finish();
    },
    cancel() {
      if (session !== null) {
        leave(session.targetId);
        finish();
      }
    },
    getSession: () => session,
    subscribe(listener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
}
