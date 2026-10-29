export interface VirtualMetrics {
  readonly scrollTop: number;
  readonly viewportHeight: number;
  readonly rowHeight: number;
  readonly rowCount: number;
}

export interface VirtualRange {
  readonly start: number;
  readonly end: number;
}

export const OVERSCAN_ROWS = 5;

const EMPTY_RANGE: VirtualRange = { start: 0, end: 0 };
const MIN_PAGE_ROWS = 1;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function isMeasured({ rowHeight, viewportHeight }: VirtualMetrics): boolean {
  return rowHeight > 0 && viewportHeight > 0;
}

export function computeVirtualRange(metrics: VirtualMetrics): VirtualRange {
  const { scrollTop, viewportHeight, rowHeight, rowCount } = metrics;

  if (!isMeasured(metrics) || rowCount === 0) {
    return EMPTY_RANGE;
  }

  const firstVisible = Math.floor(scrollTop / rowHeight);
  const lastVisible = Math.ceil((scrollTop + viewportHeight) / rowHeight);

  return {
    start: clamp(firstVisible - OVERSCAN_ROWS, 0, rowCount),
    end: clamp(lastVisible + OVERSCAN_ROWS, 0, rowCount),
  };
}

export function countPageRows({ viewportHeight, rowHeight }: VirtualMetrics): number {
  if (rowHeight <= 0) {
    return MIN_PAGE_ROWS;
  }

  return Math.max(MIN_PAGE_ROWS, Math.floor(viewportHeight / rowHeight) - 1);
}

export function scrollTopToReveal(index: number, metrics: VirtualMetrics): number {
  const { scrollTop, viewportHeight, rowHeight } = metrics;
  const rowTop = index * rowHeight;
  const rowBottom = rowTop + rowHeight;

  if (rowTop < scrollTop) {
    return rowTop;
  }
  if (rowBottom > scrollTop + viewportHeight) {
    return Math.max(0, rowBottom - viewportHeight);
  }

  return scrollTop;
}
