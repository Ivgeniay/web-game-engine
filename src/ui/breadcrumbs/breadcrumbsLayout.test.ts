import { describe, expect, it } from 'vitest';
import { countCollapsed, layoutBreadcrumbs, maxCollapsed } from './breadcrumbsLayout';

const PATH = ['Assets', 'Models', 'Props', 'Rocks'];

describe('layoutBreadcrumbs', () => {
  it('shows every level when nothing is collapsed', () => {
    expect(layoutBreadcrumbs(PATH, 0)).toEqual({
      first: 'Assets',
      hidden: [],
      visible: ['Models', 'Props', 'Rocks'],
    });
  });

  it('hides the middle levels from the start and keeps the first and the last one', () => {
    expect(layoutBreadcrumbs(PATH, 1).hidden).toEqual(['Models']);
    expect(layoutBreadcrumbs(PATH, 5)).toEqual({
      first: 'Assets',
      hidden: ['Models', 'Props'],
      visible: ['Rocks'],
    });
    expect(maxCollapsed(PATH.length)).toBe(2);
    expect(maxCollapsed(1)).toBe(0);
  });
});

describe('countCollapsed', () => {
  const WIDTHS = [60, 80, 80, 60];
  const MORE = 30;

  it('collapses nothing while everything fits', () => {
    expect(countCollapsed(WIDTHS, MORE, 280)).toBe(0);
  });

  it('collapses the middle levels one by one until the rest fits with the menu button', () => {
    expect(countCollapsed(WIDTHS, MORE, 250)).toBe(1);
    expect(countCollapsed(WIDTHS, MORE, 160)).toBe(2);
    expect(countCollapsed(WIDTHS, MORE, 10)).toBe(2);
  });
});
