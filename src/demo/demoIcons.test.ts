import { describe, expect, it } from 'vitest';
import { findIconGeometryProblems } from '@/icons/iconGeometry';
import { demoIcons } from './demoIcons';

describe('demo icons', () => {
  it.each(Object.entries(demoIcons))('%s follows the drawing rules', (_name, definition) => {
    expect(findIconGeometryProblems(definition)).toEqual([]);
  });
});
