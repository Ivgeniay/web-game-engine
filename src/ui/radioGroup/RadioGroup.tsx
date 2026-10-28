import { useCallback, useId } from 'react';
import { classNames } from '@/ui/classNames';
import { RovingFocusContext } from '@/ui/rovingFocus/rovingFocusContext';
import { useRovingFocusGroup } from '@/ui/rovingFocus/useRovingFocusGroup';
import { useRovingFocusItem } from '@/ui/rovingFocus/useRovingFocusItem';
import styles from './RadioGroup.module.css';

export type RadioGroupOrientation = 'vertical' | 'horizontal';

export interface RadioGroupOption<T extends string> {
  readonly value: T;
  readonly label: string;
  readonly lang?: string;
  readonly disabled?: boolean;
}

interface RadioGroupProps<T extends string> {
  readonly label: string;
  readonly options: readonly RadioGroupOption<T>[];
  readonly value: NoInfer<T> | null;
  readonly onValueChange: (value: NoInfer<T>) => void;
  readonly orientation?: RadioGroupOrientation;
  readonly disabled?: boolean;
  readonly className?: string | undefined;
}

interface RadioOptionProps<T extends string> {
  readonly option: RadioGroupOption<T>;
  readonly name: string;
  readonly checked: boolean;
  readonly disabled: boolean;
  readonly onSelect: (value: T) => void;
}

function RadioOption<T extends string>({
  option,
  name,
  checked,
  disabled,
  onSelect,
}: RadioOptionProps<T>) {
  const rovingProps = useRovingFocusItem<HTMLInputElement>({
    ref: undefined,
    tabIndex: undefined,
    onFocus: undefined,
    disabled,
    preferred: checked,
  });

  return (
    <label className={classNames(styles.option, disabled && styles.disabled)} lang={option.lang}>
      <span className={styles.circle}>
        <input
          {...rovingProps}
          className={styles.input}
          type="radio"
          name={name}
          value={option.value}
          checked={checked}
          disabled={disabled}
          onChange={() => {
            onSelect(option.value);
          }}
        />
        {checked && <span className={styles.dot} />}
      </span>
      <span className={styles.label}>{option.label}</span>
    </label>
  );
}

export function RadioGroup<T extends string>({
  label,
  options,
  value,
  onValueChange,
  orientation = 'vertical',
  disabled = false,
  className,
}: RadioGroupProps<T>) {
  const name = useId();

  const selectFocused = useCallback(
    (element: HTMLElement) => {
      const focusedOption = options.find(
        (option) => element instanceof HTMLInputElement && option.value === element.value,
      );

      if (focusedOption !== undefined) {
        onValueChange(focusedOption.value);
      }
    },
    [options, onValueChange],
  );

  const { registry, onKeyDown } = useRovingFocusGroup({
    orientation: 'both',
    onNavigate: selectFocused,
  });

  return (
    <RovingFocusContext value={registry}>
      <div
        className={classNames(styles.root, styles[orientation], className)}
        role="radiogroup"
        aria-label={label}
        onKeyDown={onKeyDown}
      >
        {options.map((option) => (
          <RadioOption
            key={option.value}
            option={option}
            name={name}
            checked={option.value === value}
            disabled={disabled || option.disabled === true}
            onSelect={onValueChange}
          />
        ))}
      </div>
    </RovingFocusContext>
  );
}
