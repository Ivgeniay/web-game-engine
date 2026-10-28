import { useCallback, useSyncExternalStore } from 'react';

function subscribeToNothing(): () => void {
  return () => undefined;
}

function isNotTruncatedOnServer(): boolean {
  return false;
}

export function useIsTruncated(element: HTMLElement | null): boolean {
  const subscribe = useCallback(
    (onResize: () => void) => {
      if (element === null) {
        return subscribeToNothing();
      }

      const observer = new ResizeObserver(onResize);
      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    },
    [element],
  );

  return useSyncExternalStore(
    subscribe,
    () => element !== null && element.scrollWidth > element.clientWidth,
    isNotTruncatedOnServer,
  );
}
