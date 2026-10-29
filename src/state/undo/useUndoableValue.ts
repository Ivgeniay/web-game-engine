import { useCallback, useEffect, useRef } from 'react';
import type { ValueChangeHandler, ValueChangePhase } from '@/contracts/valueChange';
import type { MessageRef } from '@/core/i18n/translate';
import { createUndoableValue } from '@/core/undo/undoableValue';
import type { UndoableValueOptions } from '@/core/undo/undoableValue';
import { useEditorRegistries } from '@/state/registries/registriesContext';

export interface UndoableValueBinding<T> {
  readonly label: MessageRef;
  readonly read: () => T;
  readonly write: (value: T) => void;
  readonly equals?: ((first: T, second: T) => boolean) | undefined;
}

export function useUndoableValue<T>(binding: UndoableValueBinding<T>): ValueChangeHandler<T> {
  const { undo } = useEditorRegistries();
  const optionsRef = useRef<UndoableValueOptions<T>>({ ...binding, undo });
  const handlerRef = useRef<ValueChangeHandler<T> | null>(null);

  useEffect(() => {
    optionsRef.current = { ...binding, undo };
  });

  return useCallback((value: T, phase: ValueChangePhase) => {
    handlerRef.current ??= createUndoableValue(() => optionsRef.current);
    handlerRef.current(value, phase);
  }, []);
}
