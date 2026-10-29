import { describe, expect, it } from 'vitest';
import {
  OVERSCAN_ROWS,
  computeVirtualRange,
  countPageRows,
  scrollTopToReveal,
} from './virtualRange';
import type { VirtualMetrics } from './virtualRange';

const ROW_HEIGHT = 20;
const VISIBLE_ROWS = 10;
const ROW_COUNT = 10_000;
const MIDDLE_ROW = 500;
const SCROLLED_FIRST_ROW = 100;
const ROW_INSIDE_VIEWPORT = 105;
const ROW_ABOVE_VIEWPORT = 40;
const ROW_BELOW_VIEWPORT = 200;

const TOP: VirtualMetrics = {
  scrollTop: 0,
  viewportHeight: ROW_HEIGHT * VISIBLE_ROWS,
  rowHeight: ROW_HEIGHT,
  rowCount: ROW_COUNT,
};

describe('computeVirtualRange', () => {
  it('takes the visible rows and the overscan below at the top', () => {
    expect(computeVirtualRange(TOP)).toEqual({ start: 0, end: VISIBLE_ROWS + OVERSCAN_ROWS });
  });

  it('adds the overscan on both sides in the middle', () => {
    expect(computeVirtualRange({ ...TOP, scrollTop: MIDDLE_ROW * ROW_HEIGHT })).toEqual({
      start: MIDDLE_ROW - OVERSCAN_ROWS,
      end: MIDDLE_ROW + VISIBLE_ROWS + OVERSCAN_ROWS,
    });
  });

  it('includes a partly visible row', () => {
    const halfRow = ROW_HEIGHT / 2;

    expect(computeVirtualRange({ ...TOP, scrollTop: halfRow })).toEqual({
      start: 0,
      end: VISIBLE_ROWS + 1 + OVERSCAN_ROWS,
    });
  });

  it('does not go past the last row', () => {
    const scrollTop = (ROW_COUNT - VISIBLE_ROWS) * ROW_HEIGHT;

    expect(computeVirtualRange({ ...TOP, scrollTop })).toEqual({
      start: ROW_COUNT - VISIBLE_ROWS - OVERSCAN_ROWS,
      end: ROW_COUNT,
    });
  });

  it('is empty before the list is measured or without rows', () => {
    expect(computeVirtualRange({ ...TOP, rowHeight: 0 })).toEqual({ start: 0, end: 0 });
    expect(computeVirtualRange({ ...TOP, viewportHeight: 0 })).toEqual({ start: 0, end: 0 });
    expect(computeVirtualRange({ ...TOP, rowCount: 0 })).toEqual({ start: 0, end: 0 });
  });
});

describe('countPageRows', () => {
  it('keeps one visible row of the previous page', () => {
    expect(countPageRows(TOP)).toBe(VISIBLE_ROWS - 1);
  });

  it('moves at least one row', () => {
    expect(countPageRows({ ...TOP, viewportHeight: ROW_HEIGHT })).toBe(1);
    expect(countPageRows({ ...TOP, rowHeight: 0 })).toBe(1);
  });
});

describe('scrollTopToReveal', () => {
  const scrolled: VirtualMetrics = { ...TOP, scrollTop: SCROLLED_FIRST_ROW * ROW_HEIGHT };

  it('keeps the position when the row is visible', () => {
    expect(scrollTopToReveal(ROW_INSIDE_VIEWPORT, scrolled)).toBe(scrolled.scrollTop);
  });

  it('aligns a row above the viewport to the top', () => {
    expect(scrollTopToReveal(ROW_ABOVE_VIEWPORT, scrolled)).toBe(ROW_ABOVE_VIEWPORT * ROW_HEIGHT);
  });

  it('aligns a row below the viewport to the bottom', () => {
    expect(scrollTopToReveal(ROW_BELOW_VIEWPORT, scrolled)).toBe(
      (ROW_BELOW_VIEWPORT + 1 - VISIBLE_ROWS) * ROW_HEIGHT,
    );
  });
});
