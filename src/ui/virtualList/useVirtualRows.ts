import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { computeVirtualRange, countPageRows, scrollTopToReveal } from './virtualRange';
import type { VirtualMetrics } from './virtualRange';

export const ROW_HEIGHT_TOKEN = '--size-list-row-height';

export interface VirtualRows {
  readonly rowHeight: number;
  readonly start: number;
  readonly end: number;
  readonly totalHeight: number;
  readonly pageRowCount: number;
  readonly revealIndex: (index: number) => void;
}

const NOT_MEASURED = 0;

function subscribeToNothing(): () => void {
  return () => undefined;
}

function readNothing(): number {
  return NOT_MEASURED;
}

function parsePixels(value: string): number {
  const pixels = Number.parseFloat(value);

  return Number.isFinite(pixels) ? pixels : NOT_MEASURED;
}

function useElementMetric(
  element: HTMLElement | null,
  read: (element: HTMLElement) => number,
): number {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (element === null) {
        return subscribeToNothing();
      }

      const observer = new ResizeObserver(onChange);
      observer.observe(element);
      element.addEventListener('scroll', onChange, { passive: true });

      return () => {
        observer.disconnect();
        element.removeEventListener('scroll', onChange);
      };
    },
    [element],
  );
  const getSnapshot = useCallback(
    () => (element === null ? NOT_MEASURED : read(element)),
    [element, read],
  );

  return useSyncExternalStore(subscribe, getSnapshot, readNothing);
}

function readRowHeight(element: HTMLElement): number {
  return parsePixels(getComputedStyle(element).getPropertyValue(ROW_HEIGHT_TOKEN));
}

function readScrollTop(element: HTMLElement): number {
  return element.scrollTop;
}

function readViewportHeight(element: HTMLElement): number {
  return element.clientHeight;
}

export function useVirtualRows(element: HTMLElement | null, rowCount: number): VirtualRows {
  const rowHeight = useElementMetric(element, readRowHeight);
  const scrollTop = useElementMetric(element, readScrollTop);
  const viewportHeight = useElementMetric(element, readViewportHeight);

  const metrics = useMemo<VirtualMetrics>(
    () => ({ scrollTop, viewportHeight, rowHeight, rowCount }),
    [scrollTop, viewportHeight, rowHeight, rowCount],
  );

  const revealIndex = useCallback(
    (index: number) => {
      if (element === null) {
        return;
      }

      const current = { ...metrics, scrollTop: element.scrollTop };
      const target = scrollTopToReveal(index, current);

      if (target !== current.scrollTop) {
        element.scrollTo({ top: target });
      }
    },
    [element, metrics],
  );

  const { start, end } = computeVirtualRange(metrics);

  return {
    rowHeight,
    start,
    end,
    totalHeight: rowHeight * rowCount,
    pageRowCount: countPageRows(metrics),
    revealIndex,
  };
}
