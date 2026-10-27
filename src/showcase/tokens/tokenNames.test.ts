import { describe, expect, it } from 'vitest';
import {
  GROUPED_TOKEN_NAMES,
  SIZE_TOKEN_KINDS,
  filterTokenNames,
  getSizeTokenNames,
} from './tokenNames';

const NAMES = ['--size-icon-sm', '--size-icon-md', '--size-tab-height', '--space-4'];

describe('filterTokenNames', () => {
  it('keeps names that start with any of the prefixes', () => {
    expect(filterTokenNames(NAMES, ['--size-icon-', '--space-'])).toEqual([
      '--size-icon-sm',
      '--size-icon-md',
      '--space-4',
    ]);
  });

  it('returns nothing without prefixes', () => {
    expect(filterTokenNames(NAMES, [])).toEqual([]);
  });
});

describe('getSizeTokenNames', () => {
  it('assigns every size token to exactly one kind', () => {
    for (const name of GROUPED_TOKEN_NAMES.size) {
      const kinds = SIZE_TOKEN_KINDS.filter((kind) => getSizeTokenNames(kind).includes(name));

      expect(kinds, name).toHaveLength(1);
    }
  });

  it('has at least one token of every kind', () => {
    for (const kind of SIZE_TOKEN_KINDS) {
      expect(getSizeTokenNames(kind).length, kind).toBeGreaterThan(0);
    }
  });
});
