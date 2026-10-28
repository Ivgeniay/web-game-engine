import { useCallback, useMemo } from 'react';
import type { KeyboardEvent } from 'react';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { useLocale } from '@/ui/locale/useLocale';
import type { FieldSize } from '@/ui/textField/fieldBox';
import { FieldInput } from '@/ui/textField/FieldInput';
import type { FieldNativeInputProps } from '@/ui/textField/FieldInput';
import type { TextFieldUpdateMode } from '@/ui/textField/TextField';
import { arrowStepCount, DEFAULT_STEP, offsetNumber } from './numberStep';
import { acceptsNumberText, createNumberFormat, formatNumber, readNumberText } from './numberText';
import type { NumberFieldMessages, NumberKind, NumberLimits } from './numberText';

type NumberNativeInputProps = Omit<
  FieldNativeInputProps,
  'role' | 'aria-valuenow' | 'aria-valuemin' | 'aria-valuemax' | 'aria-valuetext'
>;

interface NumberFieldProps extends NumberNativeInputProps {
  readonly value: number;
  readonly onValueChange?: ValueChangeHandler<number> | undefined;
  readonly kind?: NumberKind;
  readonly min?: number | undefined;
  readonly max?: number | undefined;
  readonly step?: number | undefined;
  readonly precision?: number | undefined;
  readonly invalidMessages: NumberFieldMessages;
  readonly updateMode?: TextFieldUpdateMode | undefined;
  readonly mixed?: boolean | undefined;
  readonly size?: FieldSize;
}

const DEFAULT_PRECISION = 3;
const EDIT_PRECISION = 15;
const ARROW_DIRECTIONS: Readonly<Record<string, number>> = { ArrowUp: 1, ArrowDown: -1 };

export function NumberField({
  value,
  onValueChange,
  kind = 'float',
  min,
  max,
  step = DEFAULT_STEP[kind],
  precision = DEFAULT_PRECISION,
  invalidMessages,
  updateMode = 'delayed',
  mixed = false,
  size = 'md',
  ...inputProps
}: NumberFieldProps) {
  const locale = useLocale();
  const limits = useMemo<NumberLimits>(() => ({ kind, min, max }), [kind, min, max]);
  const displayFormat = useMemo(
    () => createNumberFormat(locale, kind, precision),
    [locale, kind, precision],
  );
  const editFormat = useMemo(
    () => createNumberFormat(locale, kind, EDIT_PRECISION),
    [locale, kind],
  );

  const format = useCallback(
    (number: number) => formatNumber(number, displayFormat),
    [displayFormat],
  );
  const read = useCallback(
    (text: string) => readNumberText(text, limits, invalidMessages),
    [limits, invalidMessages],
  );
  const accepts = useCallback((text: string) => acceptsNumberText(text, limits), [limits]);

  const keyEdit = useCallback(
    (event: KeyboardEvent<HTMLInputElement>, text: string): string | undefined => {
      const direction = ARROW_DIRECTIONS[event.key];

      if (direction === undefined || event.ctrlKey || event.metaKey) {
        return undefined;
      }

      const reading = read(text);
      const base = reading.valid ? reading.value : (reading.fallback ?? value);
      const count = arrowStepCount(direction, event, step, limits);

      return formatNumber(offsetNumber(base, count, step, limits), editFormat);
    },
    [read, value, step, limits, editFormat],
  );

  return (
    <FieldInput
      {...inputProps}
      role="spinbutton"
      aria-valuenow={mixed ? undefined : value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={mixed ? undefined : format(value)}
      value={value}
      onValueChange={onValueChange}
      live={updateMode === 'live'}
      mixed={mixed}
      type="text"
      size={size}
      format={format}
      read={read}
      accepts={accepts}
      keyEdit={keyEdit}
    />
  );
}
