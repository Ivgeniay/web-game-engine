import { useMemo } from 'react';
import type { Ref, RefCallback } from 'react';

function assignRef<T>(ref: Ref<T> | undefined, value: T | null): void {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    ref.current = value;
  }
}

export function useMergedRefs<T>(first: Ref<T> | undefined, second: Ref<T> | undefined) {
  return useMemo<RefCallback<T>>(
    () => (value) => {
      assignRef(first, value);
      assignRef(second, value);
    },
    [first, second],
  );
}
