import type { TextReading } from '@/ui/textField/textEditSession';

export const NUMBER_KINDS = ['integer', 'float'] as const;

export type NumberKind = (typeof NUMBER_KINDS)[number];

export interface NumberLimits {
  readonly kind: NumberKind;
  readonly min: number | undefined;
  readonly max: number | undefined;
}

export interface NumberFieldMessages {
  readonly incomplete: string;
  readonly belowMin: string;
  readonly aboveMax: string;
}

const INTEGER_TEXT = /^-?\d*$/;
const NON_NEGATIVE_INTEGER_TEXT = /^\d*$/;
const FLOAT_TEXT = /^-?\d*[.,]?\d*$/;
const NON_NEGATIVE_FLOAT_TEXT = /^\d*[.,]?\d*$/;
const INCOMPLETE_TEXT = /^-?[.,]?$/;
const DECIMAL_COMMA = ',';
const DECIMAL_POINT = '.';
const UNICODE_MINUS = '−';
const HYPHEN_MINUS = '-';
const NO_FRACTION_DIGITS = 0;

export function allowsNegative({ min }: NumberLimits): boolean {
  return min === undefined || min < 0;
}

export function acceptsNumberText(text: string, limits: NumberLimits): boolean {
  const negative = allowsNegative(limits);
  const pattern =
    limits.kind === 'integer'
      ? negative
        ? INTEGER_TEXT
        : NON_NEGATIVE_INTEGER_TEXT
      : negative
        ? FLOAT_TEXT
        : NON_NEGATIVE_FLOAT_TEXT;

  return pattern.test(text);
}

function effectiveMin({ kind, min }: NumberLimits): number | undefined {
  return kind === 'integer'
    ? Math.max(min ?? Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER)
    : min;
}

function effectiveMax({ kind, max }: NumberLimits): number | undefined {
  return kind === 'integer'
    ? Math.min(max ?? Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
    : max;
}

export function clampNumber(value: number, limits: NumberLimits): number {
  const min = effectiveMin(limits);
  const max = effectiveMax(limits);
  const clamped = Math.min(Math.max(value, min ?? value), max ?? value);

  return Object.is(clamped, -0) ? 0 : clamped;
}

export function readNumberText(
  text: string,
  limits: NumberLimits,
  messages: NumberFieldMessages,
): TextReading<number> {
  const incomplete = { valid: false, message: messages.incomplete, fallback: undefined } as const;

  if (INCOMPLETE_TEXT.test(text) || !acceptsNumberText(text, limits)) {
    return incomplete;
  }

  const parsed = Number(text.replace(DECIMAL_COMMA, DECIMAL_POINT));

  if (!Number.isFinite(parsed)) {
    return incomplete;
  }

  const value = clampNumber(parsed, limits);

  if (value === parsed) {
    return { valid: true, value };
  }

  return {
    valid: false,
    message: parsed < value ? messages.belowMin : messages.aboveMax,
    fallback: value,
  };
}

export function createNumberFormat(
  locale: string,
  kind: NumberKind,
  precision: number,
): Intl.NumberFormat {
  return new Intl.NumberFormat(locale, {
    useGrouping: false,
    signDisplay: 'negative',
    maximumFractionDigits: kind === 'integer' ? NO_FRACTION_DIGITS : precision,
  });
}

export function formatNumber(value: number, format: Intl.NumberFormat): string {
  return format.format(value).replace(UNICODE_MINUS, HYPHEN_MINUS);
}
