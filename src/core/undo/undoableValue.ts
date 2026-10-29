import type { ValueChangeHandler } from '@/contracts/valueChange';
import type { MessageRef } from '@/core/i18n/translate';
import type { UndoStack } from './undoStack';

export interface UndoableValueOptions<T> {
  readonly undo: UndoStack;
  readonly label: MessageRef;
  readonly read: () => T;
  readonly write: (value: T) => void;
  readonly equals?: ((first: T, second: T) => boolean) | undefined;
}

export function sameValue(first: unknown, second: unknown): boolean {
  if (Array.isArray(first) && Array.isArray(second)) {
    return (
      first.length === second.length &&
      first.every((item: unknown, index) => sameValue(item, second[index]))
    );
  }

  return Object.is(first, second);
}

export function createUndoableValue<T>(
  getOptions: () => UndoableValueOptions<T>,
): ValueChangeHandler<T> {
  let start: { readonly value: T } | null = null;

  return (value, phase) => {
    const { undo, label, read, write, equals = sameValue } = getOptions();

    if (phase === 'preview') {
      start ??= { value: read() };
      write(value);
      return;
    }

    const initial = start?.value ?? read();
    start = null;

    if (phase === 'cancel') {
      write(initial);
      return;
    }

    write(value);

    if (!equals(initial, value)) {
      undo.push({
        label,
        undo: () => {
          write(initial);
        },
        redo: () => {
          write(value);
        },
      });
    }
  };
}
