import { useCallback, useEffect, useRef } from 'react';
import type { PropertyAccess, TargetsChangeHandler } from '@/contracts/property';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { createTargetsChangeHandler, readTargetsValue } from '@/core/inspector/targetsValue';
import type { TargetsValue, TargetsValueOptions } from '@/core/inspector/targetsValue';
import type { MessageRef } from '@/core/i18n/translate';
import { useEditorRegistries } from '@/state/registries/registriesContext';

export interface TargetsBindingOptions<T> {
  readonly access: PropertyAccess<T>;
  readonly targetIds: readonly string[];
  readonly label: MessageRef;
  readonly equals: (first: T, second: T) => boolean;
}

export interface TargetsBinding<T> extends TargetsValue<T> {
  readonly onValueChange: ValueChangeHandler<T>;
  readonly onTargetsChange: TargetsChangeHandler<T>;
}

export function useTargetsValue<T>(options: TargetsBindingOptions<T>): TargetsBinding<T> | null {
  const { undo } = useEditorRegistries();
  const optionsRef = useRef<TargetsValueOptions<T>>({ ...options, undo });
  const handlerRef = useRef<TargetsChangeHandler<T> | null>(null);

  useEffect(() => {
    optionsRef.current = { ...options, undo };
  });

  const onTargetsChange = useCallback<TargetsChangeHandler<T>>((change, phase) => {
    handlerRef.current ??= createTargetsChangeHandler(() => optionsRef.current);
    handlerRef.current(change, phase);
  }, []);

  const onValueChange = useCallback<ValueChangeHandler<T>>(
    (value, phase) => {
      onTargetsChange(() => value, phase);
    },
    [onTargetsChange],
  );

  const current = readTargetsValue(options.access, options.targetIds, options.equals);

  return current === null ? null : { ...current, onValueChange, onTargetsChange };
}
