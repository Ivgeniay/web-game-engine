import { useCallback, useContext, useEffect, useId, useState, useSyncExternalStore } from 'react';
import type { FocusEvent, FocusEventHandler, Ref, RefCallback } from 'react';
import { useMergedRefs } from '@/ui/useMergedRefs';
import { RovingFocusContext } from './rovingFocusContext';

export interface RovingFocusItemOptions<E extends HTMLElement> {
  readonly ref: Ref<E> | undefined;
  readonly tabIndex: number | undefined;
  readonly onFocus: FocusEventHandler<E> | undefined;
  readonly disabled: boolean;
  readonly preferred: boolean;
}

export interface RovingFocusItemProps<E extends HTMLElement> {
  readonly ref: RefCallback<E>;
  readonly tabIndex: number | undefined;
  readonly onFocus: FocusEventHandler<E>;
}

const TAB_STOP_INDEX = 0;
const SKIPPED_TAB_INDEX = -1;

function subscribeToNothing(): () => void {
  return () => undefined;
}

export function useRovingFocusItem<E extends HTMLElement>({
  ref,
  tabIndex,
  onFocus,
  disabled,
  preferred,
}: RovingFocusItemOptions<E>): RovingFocusItemProps<E> {
  const registry = useContext(RovingFocusContext);
  const id = useId();
  const [element, setElement] = useState<E | null>(null);
  const mergedRef = useMergedRefs(ref, setElement);

  useEffect(() => {
    if (registry === null || element === null) {
      return undefined;
    }

    registry.setItem(id, { element, disabled, preferred });

    return () => {
      registry.removeItem(id);
    };
  }, [registry, id, element, disabled, preferred]);

  const isTabStop = useSyncExternalStore(
    registry?.subscribe ?? subscribeToNothing,
    () => registry?.getTabStopId() === id,
  );

  const handleFocus = useCallback(
    (event: FocusEvent<E>) => {
      registry?.setActive(id);
      onFocus?.(event);
    },
    [registry, id, onFocus],
  );

  const rovingTabIndex = isTabStop ? TAB_STOP_INDEX : SKIPPED_TAB_INDEX;

  return {
    ref: mergedRef,
    tabIndex: registry === null ? tabIndex : rovingTabIndex,
    onFocus: handleFocus,
  };
}
