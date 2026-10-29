import { arrowStepCount, offsetNumber, stepMultiplier } from '@/ui/numberField/numberStep';
import type { StepModifiers } from '@/ui/numberField/numberStep';
import { clampNumber } from '@/ui/numberField/numberText';
import type { NumberKind, NumberLimits } from '@/ui/numberField/numberText';

export const SLIDER_SCALES = ['linear', 'log'] as const;

export type SliderScale = (typeof SLIDER_SCALES)[number];

export interface SliderRange {
  readonly min: number;
  readonly max: number;
  readonly scale: SliderScale;
  readonly kind: NumberKind;
}

export const PAGE_STEP_COUNT = 10;
export const LOG_KEY_POSITIONS = 100;

const MIN_POSITION = 0;
const MAX_POSITION = 1;
const DECIMAL_BASE = 10;
const MAX_DECIMAL_PLACES = 15;

const KEY_DIRECTIONS: Readonly<Record<string, number>> = {
  ArrowLeft: -1,
  ArrowDown: -1,
  ArrowRight: 1,
  ArrowUp: 1,
  PageDown: -PAGE_STEP_COUNT,
  PageUp: PAGE_STEP_COUNT,
};

export interface SliderRangeCheck {
  readonly range: SliderRange;
  readonly movable: boolean;
  readonly problem: string | undefined;
}

export function checkSliderRange(range: SliderRange): SliderRangeCheck {
  const { min, max, scale } = range;

  if (!(max > min)) {
    return {
      range: { ...range, scale: 'linear' },
      movable: false,
      problem: `Slider needs max greater than min, got ${String(min)} and ${String(max)}`,
    };
  }

  if (scale === 'log' && !(min > 0)) {
    return {
      range: { ...range, scale: 'linear' },
      movable: true,
      problem: `A logarithmic slider needs a positive min, got ${String(min)}`,
    };
  }

  return { range, movable: true, problem: undefined };
}

function clampPosition(position: number): number {
  return Math.min(Math.max(position, MIN_POSITION), MAX_POSITION);
}

function limitsOf({ min, max, kind }: SliderRange): NumberLimits {
  return { kind, min, max };
}

export function valueToPosition(value: number, range: SliderRange): number {
  const { min, max, scale } = range;

  if (!(max > min)) {
    return MIN_POSITION;
  }

  const clamped = clampNumber(value, limitsOf(range));
  const position =
    scale === 'log' ? Math.log(clamped / min) / Math.log(max / min) : (clamped - min) / (max - min);

  return clampPosition(position);
}

function rawValue(position: number, { min, max, scale }: SliderRange): number {
  return scale === 'log' ? min * (max / min) ** position : min + position * (max - min);
}

function valueResolution(value: number, range: SliderRange, divisions: number): number {
  const { min, max, scale } = range;

  return scale === 'log' ? (value * Math.log(max / min)) / divisions : (max - min) / divisions;
}

function roundToResolution(value: number, resolution: number): number {
  const places = Math.min(Math.max(Math.ceil(-Math.log10(resolution)), 0), MAX_DECIMAL_PLACES);
  const factor = DECIMAL_BASE ** places;

  return Math.round(value * factor) / factor;
}

export function positionToValue(position: number, range: SliderRange, divisions: number): number {
  const value = rawValue(clampPosition(position), range);
  const rounded =
    range.kind === 'integer'
      ? Math.round(value)
      : roundToResolution(value, valueResolution(value, range, divisions));

  return clampNumber(rounded, limitsOf(range));
}

function logKeyValue(value: number, count: number, range: SliderRange): number {
  const position = valueToPosition(value, range) + count / LOG_KEY_POSITIONS;
  const next = positionToValue(position, range, LOG_KEY_POSITIONS);

  if (range.kind === 'integer' && next === value && count !== 0) {
    return clampNumber(value + Math.sign(count), limitsOf(range));
  }

  return next;
}

export function sliderKeyValue(
  key: string,
  modifiers: StepModifiers,
  value: number,
  step: number,
  range: SliderRange,
): number | undefined {
  if (key === 'Home') {
    return range.min;
  }

  if (key === 'End') {
    return range.max;
  }

  const direction = KEY_DIRECTIONS[key];

  if (direction === undefined) {
    return undefined;
  }

  if (range.scale === 'log') {
    return logKeyValue(value, direction * stepMultiplier(modifiers), range);
  }

  const limits = limitsOf(range);

  return offsetNumber(value, arrowStepCount(direction, modifiers, step, limits), step, limits);
}
