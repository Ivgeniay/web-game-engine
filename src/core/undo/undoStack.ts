import type { UndoOperation } from '@/contracts/undo';
import type { MessageRef } from '@/core/i18n/translate';
import type { Unsubscribe } from '@/core/unsubscribe';

export interface UndoStack {
  readonly push: (operation: UndoOperation) => void;
  readonly group: (label: MessageRef, run: () => void) => void;
  readonly undo: () => boolean;
  readonly redo: () => boolean;
  readonly canUndo: () => boolean;
  readonly canRedo: () => boolean;
  readonly peekUndo: () => UndoOperation | undefined;
  readonly peekRedo: () => UndoOperation | undefined;
  readonly clear: () => void;
  readonly subscribe: (listener: () => void) => Unsubscribe;
}

export interface UndoStackOptions {
  readonly limit?: number | undefined;
}

export const DEFAULT_UNDO_LIMIT = 200;

interface OpenGroup {
  readonly label: MessageRef;
  readonly operations: UndoOperation[];
}

function combineOperations(label: MessageRef, operations: readonly UndoOperation[]): UndoOperation {
  return {
    label,
    undo() {
      for (const operation of [...operations].reverse()) {
        operation.undo();
      }
    },
    redo() {
      for (const operation of operations) {
        operation.redo();
      }
    },
  };
}

export function createUndoStack({ limit = DEFAULT_UNDO_LIMIT }: UndoStackOptions = {}): UndoStack {
  const done: UndoOperation[] = [];
  const undone: UndoOperation[] = [];
  const listeners = new Set<() => void>();
  let openGroup: OpenGroup | null = null;
  let applying = false;

  function changed(): void {
    for (const listener of [...listeners]) {
      listener();
    }
  }

  function record(operation: UndoOperation): void {
    done.push(operation);
    undone.length = 0;

    if (done.length > limit) {
      done.splice(0, done.length - limit);
    }

    changed();
  }

  function move(
    from: UndoOperation[],
    to: UndoOperation[],
    step: (operation: UndoOperation) => void,
  ): boolean {
    const operation = openGroup === null ? from.pop() : undefined;

    if (operation === undefined) {
      return false;
    }

    applying = true;

    try {
      step(operation);
    } finally {
      applying = false;
    }

    to.push(operation);
    changed();

    return true;
  }

  return {
    push(operation) {
      if (applying) {
        return;
      }

      if (openGroup !== null) {
        openGroup.operations.push(operation);
        return;
      }

      record(operation);
    },
    group(label, run) {
      if (openGroup !== null) {
        run();
        return;
      }

      const current: OpenGroup = { label, operations: [] };
      openGroup = current;

      try {
        run();
      } finally {
        openGroup = null;
      }

      if (current.operations.length > 0) {
        record(combineOperations(label, current.operations));
      }
    },
    undo: () =>
      move(done, undone, (operation) => {
        operation.undo();
      }),
    redo: () =>
      move(undone, done, (operation) => {
        operation.redo();
      }),
    canUndo: () => done.length > 0,
    canRedo: () => undone.length > 0,
    peekUndo: () => done.at(-1),
    peekRedo: () => undone.at(-1),
    clear() {
      done.length = 0;
      undone.length = 0;
      changed();
    },
    subscribe(listener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
}
