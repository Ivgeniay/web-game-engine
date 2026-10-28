import { clampNumber } from './numberText';
import type { NumberLimits } from './numberText';

export interface StepModifiers {
  readonly shiftKey: boolean;
  readonly altKey: boolean;
}

export const FINE_STEP_MULTIPLIER = 0.1;
export const COARSE_STEP_MULTIPLIER = 10;
export const DEFAULT_STEP = { integer: 1, float: 0.1 } as const;

const NO_MULTIPLIER = 1;
const MAX_DECIMAL_PLACES = 15;
const EXPONENT_PATTERN = /e-(\d+)$/;
const DECIMAL_BASE = 10;

export function stepMultiplier({ shiftKey, altKey }: StepModifiers): number {
  return (
    (shiftKey ? FINE_STEP_MULTIPLIER : NO_MULTIPLIER) *
    (altKey ? COARSE_STEP_MULTIPLIER : NO_MULTIPLIER)
  );
}

export function decimalPlaces(value: number): number {
  const text = String(Math.abs(value));
  const [mantissa = text] = text.split('e');
  const fraction = mantissa.split('.')[1] ?? '';
  const exponent = EXPONENT_PATTERN.exec(text)?.[1];

  return Math.min(fraction.length + Number(exponent ?? 0), MAX_DECIMAL_PLACES);
}

function roundToPlaces(value: number, places: number): number {
  const factor = DECIMAL_BASE ** places;

  return Math.round(value * factor) / factor;
}

export function offsetNumber(
  value: number,
  stepCount: number,
  step: number,
  limits: NumberLimits,
): number {
  const next = value + stepCount * step;
  const places = Math.min(
    Math.max(decimalPlaces(value), decimalPlaces(step) + decimalPlaces(stepCount)),
    MAX_DECIMAL_PLACES,
  );
  const rounded = limits.kind === 'integer' ? Math.round(next) : roundToPlaces(next, places);

  return clampNumber(rounded, limits);
}

export function arrowStepCount(
  direction: number,
  modifiers: StepModifiers,
  step: number,
  limits: NumberLimits,
): number {
  const count = direction * stepMultiplier(modifiers);
  const smallestIntegerCount = 1 / step;

  return limits.kind === 'integer' && Math.abs(count) < smallestIntegerCount
    ? Math.sign(count) * smallestIntegerCount
    : count;
}
