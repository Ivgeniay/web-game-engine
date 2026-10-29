import { useEffect, useMemo, useRef } from 'react';
import type { KeyboardEvent, Ref } from 'react';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { classNames } from '@/ui/classNames';
import { reportDevelopmentError } from '@/shared/developmentError';
import { useLocale } from '@/ui/locale/useLocale';
import { NumberField } from '@/ui/numberField/NumberField';
import { DEFAULT_STEP } from '@/ui/numberField/numberStep';
import { createNumberFormat, formatNumber } from '@/ui/numberField/numberText';
import type { NumberFieldMessages, NumberKind } from '@/ui/numberField/numberText';
import { useRovingFocusItem } from '@/ui/rovingFocus/useRovingFocusItem';
import type { FieldSize } from '@/ui/textField/fieldBox';
import type { TextFieldUpdateMode } from '@/ui/textField/TextField';
import styles from './Slider.module.css';
import { checkSliderRange, positionToValue, sliderKeyValue, valueToPosition } from './sliderScale';
import type { SliderScale } from './sliderScale';
import { usePreviewSession } from './usePreviewSession';
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

interface SliderWithField {
  readonly showField?: true | undefined;
  readonly invalidMessages: NumberFieldMessages;
}

interface SliderWithoutField {
  readonly showField: false;
  readonly invalidMessages?: never;
}

type SliderProps = SliderBaseProps &
  (SliderWithField | SliderWithoutField) &
  (SliderAriaLabel | SliderAriaLabelledBy);

const DEFAULT_PRECISION = 3;
const PERCENT = 100;

export function Slider({
  value,
  onValueChange,
  min,
  max,
  scale = 'linear',
  kind = 'float',
  step = DEFAULT_STEP[kind],
  precision = DEFAULT_PRECISION,
  showField = true,
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
  const { range, movable, problem } = useMemo(
    () => checkSliderRange({ min, max, scale, kind }),
    [min, max, scale, kind],
  );

  useEffect(() => {
    if (problem !== undefined) {
      reportDevelopmentError(problem);
    }
  }, [problem]);

  const locale = useLocale();
  const valueFormat = useMemo(
    () => createNumberFormat(locale, kind, precision),
    [locale, kind, precision],
  );
  const railRef = useRef<HTMLSpanElement>(null);
  const editable = !disabled && !readOnly && movable;
  const rovingProps = useRovingFocusItem({
    ref,
    tabIndex: disabled ? undefined : (tabIndex ?? 0),
    onFocus: undefined,
    disabled,
    preferred: false,
  });

  const session = usePreviewSession(value, onValueChange);

  const drag = useTrackDrag({
    areaRef: railRef,
    disabled: !editable,
    onStart: () => {
      session.finish(true);
    },
    onMove: (point) => {
      session.preview(positionToValue(point.x, range, point.width), undefined);
    },
    onEnd: session.finish,
  });

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (session.cancelHeldKey(event)) {
      return;
    }

    if (event.ctrlKey || event.metaKey) {
      return;
    }

    const base = session.base();
    const next = sliderKeyValue(event.key, event, base, step, range);

    if (next === undefined) {
      return;
    }

    event.preventDefault();

    if (editable && !drag.dragging) {
      session.preview(next, event.key);
    }
  }

  const position = valueToPosition(value, range);

  return (
    <div className={classNames(styles.root, className)}>
      <div
        {...rovingProps}
        role="slider"
        id={showField ? undefined : id}
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
        onKeyUp={session.releaseKey}
        onBlur={session.releaseFocus}
      >
        <span ref={railRef} className={styles.rail}>
          {!mixed && (
            <span className={styles.thumb} style={{ left: `${String(position * PERCENT)}%` }} />
          )}
        </span>
      </div>
      {showField && invalidMessages !== undefined && (
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
      )}
    </div>
  );
}
