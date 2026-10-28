import { describe, expect, it } from 'vitest';
import { circle, defineIcon, fillRect, stroke } from './icon';
import type { IconDrawing } from './icon';
import { findIconGeometryProblems } from './iconGeometry';

function problemsOf(md: IconDrawing, sm?: IconDrawing): readonly string[] {
  return findIconGeometryProblems(defineIcon(sm === undefined ? { md } : { md, sm }));
}

describe('findIconGeometryProblems', () => {
  it('accepts lines on half coordinates, circles and whole filled rects', () => {
    expect(
      problemsOf([
        stroke('M2.5 2.5 H12.5 V12.5 H2.5 Z'),
        stroke('M3.5 3.5 L11.5 11.5'),
        stroke('M3.5 7.5 A4 4 0 0 0 11.5 7.5'),
        circle(7.5, 7.5, 6),
        fillRect(7, 11, 1, 1),
      ]),
    ).toEqual([]);
  });

  it('accepts several point pairs after one command', () => {
    expect(problemsOf([stroke('M5.5 3.5 L9.5 7.5 5.5 11.5')])).toEqual([]);
  });

  it('reports horizontal and vertical lines on whole coordinates', () => {
    expect(problemsOf([stroke('M2.5 7 H12.5'), stroke('M8 2.5 V12.5')])).toEqual([
      'md, shape 0: horizontal line at y=7 is not on a half coordinate',
      'md, shape 1: vertical line at x=8 is not on a half coordinate',
    ]);
  });

  it('reports axis-aligned L segments and closing segments', () => {
    expect(problemsOf([stroke('M3 2.5 L3 12.5'), stroke('M2.5 3 L12.5 12.5 L12.5 3 Z')])).toEqual([
      'md, shape 0: vertical line at x=3 is not on a half coordinate',
      'md, shape 1: horizontal line at y=3 is not on a half coordinate',
    ]);
  });

  it('does not require half coordinates for diagonals', () => {
    expect(problemsOf([stroke('M3 3 L11 11')])).toEqual([]);
  });

  it('reports points outside the working area', () => {
    expect(problemsOf([stroke('M0.5 7.5 H14.5')])).toEqual([
      'md, shape 0: point (0.5, 7.5) is outside the working area',
    ]);
  });

  it('checks the small drawing against the 12 pixel grid', () => {
    expect(problemsOf([stroke('M2.5 7.5 H12.5')], [stroke('M1.5 5.5 H12.5')])).toEqual([
      'sm, shape 0: point (12.5, 5.5) is outside the working area',
    ]);
  });

  it('reports relative and unsupported path commands', () => {
    expect(problemsOf([stroke('M2.5 2.5 l5 5'), stroke('M2.5 2.5 C3 3 4 4 5 5')])).toEqual([
      'md, shape 0: path command l is not allowed',
      'md, shape 1: path command C is not allowed',
    ]);
  });

  it('reports paths that do not start with M or cannot be parsed', () => {
    expect(problemsOf([stroke('L2.5 2.5'), stroke('2.5 2.5')])).toEqual([
      'md, shape 0: path "L2.5 2.5" must start with M',
      'md, shape 1: path "2.5 2.5" cannot be parsed',
    ]);
  });

  it('reports a wrong number of arguments', () => {
    expect(problemsOf([stroke('M2.5 2.5 L3.5')])).toEqual([
      'md, shape 0: path command L has invalid arguments "3.5"',
    ]);
  });

  it('reports circles whose extremes are off the half coordinates or outside', () => {
    expect(problemsOf([circle(8, 8, 6), circle(7.5, 7.5, 7)])).toEqual([
      'md, shape 0: circle extremes of r=6 are not on half coordinates',
      'md, shape 1: circle of r=7 leaves the working area',
    ]);
  });

  it('reports filled rects with fractional coordinates or outside the working area', () => {
    expect(problemsOf([fillRect(7.5, 11, 1, 1), fillRect(14, 7, 2, 1)])).toEqual([
      'md, shape 0: filled rect must have whole positive coordinates',
      'md, shape 1: filled rect leaves the working area',
    ]);
  });

  it('reports an empty drawing', () => {
    expect(problemsOf([])).toEqual(['md: drawing is empty']);
  });
});
