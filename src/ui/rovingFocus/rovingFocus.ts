export const ROVING_ORIENTATIONS = ['horizontal', 'vertical'] as const;

export type RovingOrientation = (typeof ROVING_ORIENTATIONS)[number];

export const ROVING_MOVES = ['previous', 'next', 'first', 'last'] as const;

export type RovingMove = (typeof ROVING_MOVES)[number];

const MOVE_KEYS: Readonly<Record<RovingOrientation, Readonly<Record<string, RovingMove>>>> = {
  horizontal: { ArrowLeft: 'previous', ArrowRight: 'next', Home: 'first', End: 'last' },
  vertical: { ArrowUp: 'previous', ArrowDown: 'next', Home: 'first', End: 'last' },
};

const NOT_FOUND = -1;
const FORWARD = 1;
const BACKWARD = -1;

export function rovingMoveForKey(
  key: string,
  orientation: RovingOrientation,
): RovingMove | undefined {
  return MOVE_KEYS[orientation][key];
}

function firstEnabledFrom(enabled: readonly boolean[], start: number, step: number): number {
  for (let index = start; index >= 0 && index < enabled.length; index += step) {
    if (enabled[index] === true) {
      return index;
    }
  }

  return NOT_FOUND;
}

function edgeIndex(enabled: readonly boolean[], step: number): number {
  return step === FORWARD ? 0 : enabled.length - 1;
}

function stepFrom(enabled: readonly boolean[], current: number, step: number, loop: boolean) {
  if (current === NOT_FOUND) {
    return firstEnabledFrom(enabled, edgeIndex(enabled, step), step);
  }

  const next = firstEnabledFrom(enabled, current + step, step);

  if (next !== NOT_FOUND || !loop) {
    return next;
  }

  return firstEnabledFrom(enabled, edgeIndex(enabled, step), step);
}

function targetIndex(
  enabled: readonly boolean[],
  current: number,
  move: RovingMove,
  loop: boolean,
): number {
  switch (move) {
    case 'first':
      return firstEnabledFrom(enabled, edgeIndex(enabled, FORWARD), FORWARD);
    case 'last':
      return firstEnabledFrom(enabled, edgeIndex(enabled, BACKWARD), BACKWARD);
    case 'next':
      return stepFrom(enabled, current, FORWARD, loop);
    case 'previous':
      return stepFrom(enabled, current, BACKWARD, loop);
  }
}

export function findRovingTarget(
  enabled: readonly boolean[],
  current: number,
  move: RovingMove,
  loop: boolean,
): number | undefined {
  const target = targetIndex(enabled, current, move, loop);

  return target === NOT_FOUND || target === current ? undefined : target;
}
