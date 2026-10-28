import { describe, expect, it } from 'vitest';
import { frameworkIcons } from './frameworkIcons';
import { findIconGeometryProblems } from './iconGeometry';

const ICON_NAME_PATTERN = /^[a-z]+(-[a-z]+)*$/;

describe('framework icons', () => {
  it.each(Object.entries(frameworkIcons))('%s follows the drawing rules', (_name, definition) => {
    expect(findIconGeometryProblems(definition)).toEqual([]);
  });

  it('names icons in kebab case', () => {
    expect(Object.keys(frameworkIcons).filter((name) => !ICON_NAME_PATTERN.test(name))).toEqual([]);
  });

  it('contains the unknown placeholder', () => {
    expect(Object.hasOwn(frameworkIcons, 'unknown')).toBe(true);
  });
});
