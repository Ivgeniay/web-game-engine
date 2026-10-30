export interface BreadcrumbsLayout<T> {
  readonly first: T | undefined;
  readonly hidden: readonly T[];
  readonly visible: readonly T[];
}

const FIRST_INDEX = 1;
const ALWAYS_SHOWN_AT_END = 1;

export function maxCollapsed(count: number): number {
  return Math.max(0, count - FIRST_INDEX - ALWAYS_SHOWN_AT_END);
}

export function layoutBreadcrumbs<T>(items: readonly T[], collapsed: number): BreadcrumbsLayout<T> {
  const hiddenCount = Math.min(Math.max(0, collapsed), maxCollapsed(items.length));

  return {
    first: items[0],
    hidden: items.slice(FIRST_INDEX, FIRST_INDEX + hiddenCount),
    visible: items.slice(FIRST_INDEX + hiddenCount),
  };
}

export function countCollapsed(
  segmentWidths: readonly number[],
  moreWidth: number,
  availableWidth: number,
): number {
  const limit = maxCollapsed(segmentWidths.length);
  let total = segmentWidths.reduce((sum, width) => sum + width, 0);
  let collapsed = 0;

  while (total > availableWidth && collapsed < limit) {
    total -= segmentWidths[FIRST_INDEX + collapsed] ?? 0;

    if (collapsed === 0) {
      total += moreWidth;
    }

    collapsed += 1;
  }

  return collapsed;
}
