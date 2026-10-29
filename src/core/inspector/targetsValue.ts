import type { PropertyAccess, TargetsChangeHandler } from '@/contracts/property';
import type { MessageRef } from '@/core/i18n/translate';
import type { UndoStack } from '@/core/undo/undoStack';

export interface TargetsValue<T> {
  readonly value: T;
  readonly values: readonly T[];
  readonly mixed: boolean;
}

export interface TargetsValueOptions<T> {
  readonly undo: UndoStack;
  readonly label: MessageRef;
  readonly targetIds: readonly string[];
  readonly access: PropertyAccess<T>;
  readonly equals: (first: T, second: T) => boolean;
}

interface EditSession<T> {
  readonly values: ReadonlyMap<string, T>;
  readonly shown: T;
}

export function readTargetsValue<T>(
  access: PropertyAccess<T>,
  targetIds: readonly string[],
  equals: (first: T, second: T) => boolean,
): TargetsValue<T> | null {
  const values = targetIds.map((targetId) => access.read(targetId));
  const [value, ...others] = values;

  if (value === undefined) {
    return null;
  }

  return { value, values, mixed: others.some((other) => !equals(other, value)) };
}

export function createTargetsChangeHandler<T>(
  getOptions: () => TargetsValueOptions<T>,
): TargetsChangeHandler<T> {
  let session: EditSession<T> | null = null;

  return (change, phase) => {
    const { undo, label, targetIds, access, equals } = getOptions();
    const [firstId] = targetIds;

    if (firstId === undefined || (phase === 'cancel' && session === null)) {
      return;
    }

    function readAll(): ReadonlyMap<string, T> {
      return new Map(targetIds.map((targetId) => [targetId, access.read(targetId)]));
    }

    function writeAll(values: ReadonlyMap<string, T>): void {
      for (const [targetId, value] of values) {
        access.write(targetId, value);
      }
    }

    const current = session ?? { values: readAll(), shown: access.read(firstId) };
    const changed = new Map(
      [...current.values].map(([targetId, own]) => [targetId, change(own, current.shown)]),
    );

    if (phase === 'preview') {
      session = current;
      writeAll(changed);
      return;
    }

    session = null;

    if (phase === 'cancel') {
      writeAll(current.values);
      return;
    }

    writeAll(changed);
    const after = readAll();
    const differs = [...current.values].some(([targetId, before]) => {
      const now = after.get(targetId);

      return now === undefined || !equals(before, now);
    });

    if (differs) {
      undo.push({
        label,
        undo: () => {
          writeAll(current.values);
        },
        redo: () => {
          writeAll(after);
        },
      });
    }
  };
}
