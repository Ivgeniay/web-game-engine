import { useRef } from 'react';
import type { ComponentPropsWithRef, KeyboardEvent, MouseEvent } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { classNames } from '@/ui/classNames';
import { Icon } from '@/ui/icon/Icon';
import { IconButton } from '@/ui/iconButton/IconButton';
import { RovingFocusContext } from '@/ui/rovingFocus/rovingFocusContext';
import { useRovingFocusItem } from '@/ui/rovingFocus/useRovingFocusItem';
import { fieldBoxClassName, fieldInputClassName } from '@/ui/textField/fieldBox';
import { useMergedRefs } from '@/ui/useMergedRefs';
import styles from './SearchField.module.css';

type NativeInputProps = Omit<
  ComponentPropsWithRef<'input'>,
  | 'style'
  | 'type'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'children'
  | 'size'
  | 'aria-label'
  | 'aria-labelledby'
>;

interface SearchFieldProps extends NativeInputProps {
  readonly value: string;
  readonly onValueChange: (value: string) => void;
  readonly label: string;
  readonly clearLabel: string;
}

const EMPTY_QUERY = '';
const NOT_TABBABLE = -1;

export function SearchField({
  value,
  onValueChange,
  label,
  clearLabel,
  className,
  ref,
  tabIndex,
  onFocus,
  onKeyDown,
  ...inputProps
}: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRefs(ref, inputRef);
  const disabled = inputProps.disabled ?? false;
  const readOnly = inputProps.readOnly ?? false;
  const rovingProps = useRovingFocusItem({
    ref: mergedRef,
    tabIndex,
    onFocus,
    disabled,
    preferred: false,
  });
  const canClear = value !== EMPTY_QUERY && !disabled && !readOnly;

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    onKeyDown?.(event);

    if (event.defaultPrevented || event.key !== 'Escape') {
      return;
    }

    event.preventDefault();

    if (canClear) {
      onValueChange(EMPTY_QUERY);
    } else {
      event.currentTarget.blur();
    }
  }

  function keepFocusInInput(event: MouseEvent<HTMLElement>): void {
    if (event.target !== inputRef.current && inputRef.current !== null) {
      event.preventDefault();
      inputRef.current.focus();
    }
  }

  return (
    <span
      className={fieldBoxClassName({
        size: 'md',
        invalid: false,
        disabled,
        readOnly,
        className: classNames(canClear && styles.clearable, className),
      })}
      onMouseDown={keepFocusInInput}
    >
      <span className={styles.searchIcon}>
        <Icon icon={frameworkIcons.search} size="sm" />
      </span>
      <input
        {...inputProps}
        {...rovingProps}
        className={classNames(fieldInputClassName, styles.input)}
        type="search"
        value={value}
        aria-label={label}
        onChange={(event) => {
          onValueChange(event.currentTarget.value);
        }}
        onKeyDown={handleKeyDown}
      />
      {canClear && (
        <RovingFocusContext value={null}>
          <IconButton
            className={styles.clear}
            label={clearLabel}
            icon={frameworkIcons.close}
            size="sm"
            tabIndex={NOT_TABBABLE}
            onClick={() => {
              onValueChange(EMPTY_QUERY);
            }}
          />
        </RovingFocusContext>
      )}
    </span>
  );
}
