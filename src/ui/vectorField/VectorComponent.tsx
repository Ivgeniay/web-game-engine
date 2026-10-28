import { useId } from 'react';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { classNames } from '@/ui/classNames';
import { NumberField } from '@/ui/numberField/NumberField';
import type { NumberFieldMessages, NumberKind } from '@/ui/numberField/numberText';
import type { FieldSize } from '@/ui/textField/fieldBox';
import type { TextFieldUpdateMode } from '@/ui/textField/TextField';
import { useValueDrag } from '@/ui/valueDrag/useValueDrag';
import type { VectorAxis } from './vectorAxes';
import styles from './VectorField.module.css';

interface VectorComponentProps {
  readonly id: string | undefined;
  readonly groupLabelId: string | undefined;
  readonly groupLabel: string | undefined;
  readonly axis: VectorAxis;
  readonly value: number;
  readonly onValueChange: ValueChangeHandler<number>;
  readonly mixed: boolean;
  readonly kind: NumberKind;
  readonly min: number | undefined;
  readonly max: number | undefined;
  readonly step: number | undefined;
  readonly precision: number | undefined;
  readonly invalidMessages: NumberFieldMessages;
  readonly updateMode: TextFieldUpdateMode | undefined;
  readonly infiniteDrag: boolean;
  readonly disabled: boolean;
  readonly readOnly: boolean;
  readonly size: FieldSize;
}

type ComponentName =
  | { readonly 'aria-labelledby': string; readonly 'aria-label'?: never }
  | { readonly 'aria-label': string; readonly 'aria-labelledby'?: never };

function componentName(
  groupLabelId: string | undefined,
  groupLabel: string | undefined,
  axisLabelId: string,
  axisLabel: string,
): ComponentName {
  if (groupLabelId !== undefined) {
    return { 'aria-labelledby': `${groupLabelId} ${axisLabelId}` };
  }

  return groupLabel === undefined
    ? { 'aria-labelledby': axisLabelId }
    : { 'aria-label': `${groupLabel} ${axisLabel}` };
}

export function VectorComponent({
  id,
  groupLabelId,
  groupLabel,
  axis,
  value,
  onValueChange,
  mixed,
  kind,
  min,
  max,
  step,
  precision,
  invalidMessages,
  updateMode,
  infiniteDrag,
  disabled,
  readOnly,
  size,
}: VectorComponentProps) {
  const ownId = useId();
  const fieldId = id ?? ownId;
  const axisLabelId = useId();
  const { dragging, zoneProps } = useValueDrag(
    { value, onValueChange, kind, min, max, step, infinite: infiniteDrag },
    disabled || readOnly,
  );

  return (
    <span className={styles.component}>
      <label
        {...zoneProps}
        id={axisLabelId}
        htmlFor={fieldId}
        className={classNames(
          styles.axis,
          axis.mark !== undefined && styles[axis.mark],
          disabled && styles.disabled,
          zoneProps.className,
        )}
        data-dragging={dragging ? '' : undefined}
      >
        {axis.label}
      </label>
      <NumberField
        id={fieldId}
        className={styles.field}
        {...componentName(groupLabelId, groupLabel, axisLabelId, axis.label)}
        value={value}
        mixed={mixed}
        kind={kind}
        min={min}
        max={max}
        step={step}
        precision={precision}
        invalidMessages={invalidMessages}
        updateMode={updateMode}
        disabled={disabled}
        readOnly={readOnly}
        size={size}
        onValueChange={onValueChange}
      />
    </span>
  );
}
