import { useEffect, useRef } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { classNames } from '@/ui/classNames';
import { Icon } from '@/ui/icon/Icon';
import { useRovingFocusItem } from '@/ui/rovingFocus/useRovingFocusItem';
import { useMergedRefs } from '@/ui/useMergedRefs';
import styles from './Checkbox.module.css';

export type CheckboxChecked = boolean | 'mixed';

type NativeInputProps = Omit<
  ComponentPropsWithRef<'input'>,
  | 'style'
  | 'type'
  | 'checked'
  | 'defaultChecked'
  | 'onChange'
  | 'children'
  | 'aria-checked'
  | 'aria-label'
  | 'aria-labelledby'
>;

interface CheckboxBaseProps extends NativeInputProps {
  readonly checked: CheckboxChecked;
  readonly onCheckedChange: (checked: boolean) => void;
}

interface VisibleLabel {
  readonly label: string;
  readonly 'aria-label'?: never;
  readonly 'aria-labelledby'?: never;
}

interface AriaLabel {
  readonly label?: never;
  readonly 'aria-label': string;
  readonly 'aria-labelledby'?: never;
}

interface AriaLabelledBy {
  readonly label?: never;
  readonly 'aria-label'?: never;
  readonly 'aria-labelledby': string;
}

type CheckboxProps = CheckboxBaseProps & (VisibleLabel | AriaLabel | AriaLabelledBy);

export function Checkbox({
  checked,
  onCheckedChange,
  label,
  className,
  ref,
  tabIndex,
  onFocus,
  ...inputProps
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRefs(ref, inputRef);
  const disabled = inputProps.disabled ?? false;
  const mixed = checked === 'mixed';
  const rovingProps = useRovingFocusItem({
    ref: mergedRef,
    tabIndex,
    onFocus,
    disabled,
    preferred: false,
  });

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.indeterminate = mixed;
    }
  }, [mixed]);

  const box = (
    <span className={styles.box} data-state={mixed ? 'mixed' : String(checked)}>
      <input
        {...inputProps}
        {...rovingProps}
        className={styles.input}
        type="checkbox"
        checked={checked === true}
        onChange={(event) => {
          event.currentTarget.indeterminate = mixed;
          onCheckedChange(checked !== true);
        }}
      />
      {checked !== false && (
        <span className={styles.mark}>
          <Icon icon={mixed ? frameworkIcons.minus : frameworkIcons.check} />
        </span>
      )}
    </span>
  );

  const rootClassName = classNames(styles.root, disabled && styles.disabled, className);

  if (label === undefined) {
    return <span className={rootClassName}>{box}</span>;
  }

  return (
    <label className={rootClassName}>
      {box}
      <span className={styles.label}>{label}</span>
    </label>
  );
}
