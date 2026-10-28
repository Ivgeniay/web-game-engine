import { describe, expect, it } from 'vitest';
import { findRovingTarget, rovingMoveForKey } from './rovingFocus';

const ALL_ENABLED = [true, true, true, true];
const EDGES_DISABLED = [false, true, true, false];
const ALL_DISABLED = [false, false, false];
const NO_CURRENT = -1;

describe('rovingMoveForKey', () => {
  it.each([
    { key: 'ArrowLeft', move: 'previous' },
    { key: 'ArrowRight', move: 'next' },
    { key: 'Home', move: 'first' },
    { key: 'End', move: 'last' },
    { key: 'ArrowUp', move: undefined },
    { key: 'ArrowDown', move: undefined },
  ])('maps $key to $move in a horizontal group', ({ key, move }) => {
    expect(rovingMoveForKey(key, 'horizontal')).toBe(move);
  });

  it.each([
    { key: 'ArrowUp', move: 'previous' },
    { key: 'ArrowDown', move: 'next' },
    { key: 'Home', move: 'first' },
    { key: 'End', move: 'last' },
    { key: 'ArrowLeft', move: undefined },
    { key: 'ArrowRight', move: undefined },
  ])('maps $key to $move in a vertical group', ({ key, move }) => {
    expect(rovingMoveForKey(key, 'vertical')).toBe(move);
  });

  it.each([
    { key: 'ArrowLeft', move: 'previous' },
    { key: 'ArrowUp', move: 'previous' },
    { key: 'ArrowRight', move: 'next' },
    { key: 'ArrowDown', move: 'next' },
    { key: 'Home', move: 'first' },
    { key: 'End', move: 'last' },
  ])('maps $key to $move when both axes are used', ({ key, move }) => {
    expect(rovingMoveForKey(key, 'both')).toBe(move);
  });

  it('ignores other keys', () => {
    expect(rovingMoveForKey('Enter', 'horizontal')).toBeUndefined();
    expect(rovingMoveForKey(' ', 'vertical')).toBeUndefined();
  });
});

describe('findRovingTarget', () => {
  it('steps to the neighbours', () => {
    expect(findRovingTarget(ALL_ENABLED, 1, 'next', true)).toBe(2);
    expect(findRovingTarget(ALL_ENABLED, 1, 'previous', true)).toBe(0);
  });

  it('wraps around the ends when looping', () => {
    expect(findRovingTarget(ALL_ENABLED, 3, 'next', true)).toBe(0);
    expect(findRovingTarget(ALL_ENABLED, 0, 'previous', true)).toBe(3);
  });

  it('stops at the ends without looping', () => {
    expect(findRovingTarget(ALL_ENABLED, 3, 'next', false)).toBeUndefined();
    expect(findRovingTarget(ALL_ENABLED, 0, 'previous', false)).toBeUndefined();
  });

  it('skips disabled items', () => {
    expect(findRovingTarget([true, false, true], 0, 'next', true)).toBe(2);
    expect(findRovingTarget([true, false, true], 2, 'previous', true)).toBe(0);
    expect(findRovingTarget(EDGES_DISABLED, 2, 'next', true)).toBe(1);
    expect(findRovingTarget(EDGES_DISABLED, 1, 'previous', true)).toBe(2);
  });

  it('goes to the first and the last enabled item', () => {
    expect(findRovingTarget(EDGES_DISABLED, 2, 'first', true)).toBe(1);
    expect(findRovingTarget(EDGES_DISABLED, 1, 'last', true)).toBe(2);
  });

  it('starts from an edge when no item is current', () => {
    expect(findRovingTarget(EDGES_DISABLED, NO_CURRENT, 'next', true)).toBe(1);
    expect(findRovingTarget(EDGES_DISABLED, NO_CURRENT, 'previous', true)).toBe(2);
  });

  it('finds nothing when the target is the current item or every item is disabled', () => {
    expect(findRovingTarget([true, false, false], 0, 'next', true)).toBeUndefined();
    expect(findRovingTarget(ALL_ENABLED, 0, 'first', true)).toBeUndefined();
    expect(findRovingTarget(ALL_DISABLED, NO_CURRENT, 'first', true)).toBeUndefined();
    expect(findRovingTarget([], NO_CURRENT, 'next', true)).toBeUndefined();
  });
});
