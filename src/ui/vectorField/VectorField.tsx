import type { ValueChangeHandler } from '@/contracts/valueChange';
import { classNames } from '@/ui/classNames';
import type { NumberFieldMessages, NumberKind } from '@/ui/numberField/numberText';
import type { FieldSize } from '@/ui/textField/fieldBox';
import type { TextFieldUpdateMode } from '@/ui/textField/TextField';
import { replaceComponent } from './vectorAxes';
import type { VectorAxis } from './vectorAxes';
import { VectorComponent } from './VectorComponent';
import styles from './VectorField.module.css';

interface VectorFieldBaseProps {
  readonly axes: readonly VectorAxis[];
  readonly value: readonly number[];
  readonly onValueChange?: ValueChangeHandler<readonly number[]> | undefined;
  readonly mixed?: readonly boolean[] | undefined;
  readonly kind?: NumberKind;
  readonly min?: number | undefined;
  readonly max?: number | undefined;
  readonly step?: number | undefined;
  readonly precision?: number | undefined;
  readonly invalidMessages: NumberFieldMessages;
  readonly updateMode?: TextFieldUpdateMode | undefined;
  readonly infiniteDrag?: boolean | undefined;
  readonly disabled?: boolean | undefined;
  readonly readOnly?: boolean | undefined;
  readonly size?: FieldSize;
  readonly id?: string | undefined;
  readonly className?: string | undefined;
}

interface VectorFieldAriaLabel {
  readonly 'aria-label': string;
  readonly 'aria-labelledby'?: never;
}

interface VectorFieldAriaLabelledBy {
  readonly 'aria-label'?: never;
  readonly 'aria-labelledby': string;
}

type VectorFieldProps = VectorFieldBaseProps & (VectorFieldAriaLabel | VectorFieldAriaLabelledBy);

const FIRST_COMPONENT = 0;
const MISSING_COMPONENT = 0;

export function VectorField({
  axes,
  value,
  onValueChange,
  mixed,
  kind = 'float',
  min,
  max,
  step,
  precision,
  invalidMessages,
  updateMode,
  infiniteDrag = false,
  disabled = false,
  readOnly = false,
  size = 'md',
  id,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: VectorFieldProps) {
  return (
    <div
      className={classNames(styles.root, className)}
      role="group"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {axes.map((axis, index) => (
        <VectorComponent
          key={index}
          id={index === FIRST_COMPONENT ? id : undefined}
          groupLabelId={ariaLabelledBy}
          groupLabel={ariaLabel}
          axis={axis}
          value={value[index] ?? MISSING_COMPONENT}
          mixed={mixed?.[index] ?? false}
          kind={kind}
          min={min}
          max={max}
          step={step}
          precision={precision}
          invalidMessages={invalidMessages}
          updateMode={updateMode}
          infiniteDrag={infiniteDrag}
          disabled={disabled}
          readOnly={readOnly}
          size={size}
          onValueChange={(component, phase) => {
            onValueChange?.(replaceComponent(value, index, component), phase);
          }}
        />
      ))}
    </div>
  );
}
