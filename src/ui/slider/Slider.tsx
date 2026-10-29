import { useMemo, useRef } from 'react';
import type { KeyboardEvent, Ref } from 'react';
import type { ValueChangeHandler, ValueChangePhase } from '@/contracts/valueChange';
import { classNames } from '@/ui/classNames';
import { useLocale } from '@/ui/locale/useLocale';
import { NumberField } from '@/ui/numberField/NumberField';
import { DEFAULT_STEP } from '@/ui/numberField/numberStep';
import { createNumberFormat, formatNumber } from '@/ui/numberField/numberText';
import type { NumberFieldMessages, NumberKind } from '@/ui/numberField/numberText';
import { useRovingFocusItem } from '@/ui/rovingFocus/useRovingFocusItem';
import type { FieldSize } from '@/ui/textField/fieldBox';
import type { TextFieldUpdateMode } from '@/ui/textField/TextField';
import styles from './Slider.module.css';
import { assertSliderRange, positionToValue, sliderKeyValue, valueToPosition } from './sliderScale';
import type { SliderRange, SliderScale } from './sliderScale';
import { useTrackDrag } from './useTrackDrag';

interface SliderBaseProps {
  readonly value: number;
  readonly onValueChange?: ValueChangeHandler<number> | undefined;
  readonly min: number;
  readonly max: number;
  readonly scale?: SliderScale;
  readonly kind?: NumberKind;
  readonly step?: number | undefined;
  readonly precision?: number | undefined;
  readonly invalidMessages: NumberFieldMessages;
  readonly updateMode?: TextFieldUpdateMode | undefined;
  readonly mixed?: boolean | undefined;
  readonly disabled?: boolean | undefined;
  readonly readOnly?: boolean | undefined;
  readonly size?: FieldSize;
  readonly id?: string | undefined;
  readonly tabIndex?: number | undefined;
  readonly className?: string | undefined;
  readonly ref?: Ref<HTMLDivElement> | undefined;
}

interface SliderAriaLabel {
  readonly 'aria-label': string;
  readonly 'aria-labelledby'?: never;
}

interface SliderAriaLabelledBy {
  readonly 'aria-label'?: never;
  readonly 'aria-labelledby': string;
}

type SliderProps = SliderBaseProps & (SliderAriaLabel | SliderAriaLabelledBy);

interface SliderSession {
  readonly start: number;
  readonly value: number;
  readonly key: string | undefined;
}

const DEFAULT_PRECISION = 3;
const PERCENT = 100;
const ESCAPE_KEY = 'Escape';

export function Slider({
  value,
  onValueChange,
  min,
  max,
  scale = 'linear',
  kind = 'float',
  step = DEFAULT_STEP[kind],
  precision = DEFAULT_PRECISION,
  invalidMessages,
  updateMode,
  mixed = false,
  disabled = false,
  readOnly = false,
  size = 'md',
  id,
  tabIndex,
  className,
  ref,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: SliderProps) {
  const range = useMemo<SliderRange>(() => ({ min, max, scale, kind }), [min, max, scale, kind]);
  assertSliderRange(range);

  const locale = useLocale();
  const valueFormat = useMemo(
    () => createNumberFormat(locale, kind, precision),
    [locale, kind, precision],
  );
  const railRef = useRef<HTMLSpanElement>(null);
  const sessionRef = useRef<SliderSession | null>(null);
  const editable = !disabled && !readOnly;
  const rovingProps = useRovingFocusItem({
    ref,
    tabIndex: disabled ? undefined : (tabIndex ?? 0),
    onFocus: undefined,
    disabled,
    preferred: false,
  });

  function emit(next: number, phase: ValueChangePhase): void {
    onValueChange?.(next, phase);
  }

  function preview(next: number, key: string | undefined): void {
    const session = sessionRef.current ?? { start: value, value, key };
    sessionRef.current = { ...session, value: next, key };
    emit(next, 'preview');
  }

  function finish(commit: boolean): void {
    const session = sessionRef.current;
    sessionRef.current = null;

    if (session !== null) {
      emit(commit ? session.value : session.start, commit ? 'commit' : 'cancel');
    }
  }

  const drag = useTrackDrag({
    areaRef: railRef,
    disabled: !editable,
    onStart: () => {
      finish(true);
    },
    onMove: (point) => {
      preview(positionToValue(point.x, range, point.width), undefined);
    },
    onEnd: finish,
  });

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === ESCAPE_KEY && sessionRef.current?.key !== undefined) {
      event.preventDefault();
      event.stopPropagation();
      finish(false);
      return;
    }

    if (event.ctrlKey || event.metaKey) {
      return;
    }

    const base = sessionRef.current?.value ?? value;
    const next = sliderKeyValue(event.key, event, base, step, range);

    if (next === undefined) {
      return;
    }

    event.preventDefault();

    if (editable && !drag.dragging) {
      preview(next, event.key);
    }
  }

  function handleKeyUp(event: KeyboardEvent<HTMLDivElement>): void {
    if (sessionRef.current !== null && sessionRef.current.key === event.key) {
      finish(true);
    }
  }

  function handleBlur(): void {
    if (sessionRef.current?.key !== undefined) {
      finish(true);
    }
  }

  const position = valueToPosition(value, range);

  return (
    <div className={classNames(styles.root, className)}>
      <div
        {...rovingProps}
        role="slider"
        className={classNames(styles.track, styles[size])}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={mixed ? undefined : value}
        aria-valuetext={mixed ? undefined : formatNumber(value, valueFormat)}
        aria-disabled={disabled ? true : undefined}
        aria-readonly={readOnly ? true : undefined}
        data-dragging={drag.dragging ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        onPointerDown={drag.onPointerDown}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onBlur={handleBlur}
      >
        <span ref={railRef} className={styles.rail}>
          {!mixed && (
            <span className={styles.thumb} style={{ left: `${String(position * PERCENT)}%` }} />
          )}
        </span>
      </div>
      <NumberField
        id={id}
        className={styles.field}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        value={value}
        onValueChange={onValueChange}
        kind={kind}
        min={min}
        max={max}
        step={step}
        precision={precision}
        invalidMessages={invalidMessages}
        updateMode={updateMode}
        mixed={mixed}
        disabled={disabled}
        readOnly={readOnly}
        size={size}
      />
    </div>
  );
}
