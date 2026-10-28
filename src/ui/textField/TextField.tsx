import { useRef } from 'react';
import type { ComponentPropsWithRef, KeyboardEvent, MouseEvent } from 'react';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { useRovingFocusItem } from '@/ui/rovingFocus/useRovingFocusItem';
import { TooltipBubble } from '@/ui/tooltip/TooltipBubble';
import { useMergedRefs } from '@/ui/useMergedRefs';
import {
  fieldBoxClassName,
  fieldInputClassName,
  joinIds,
  MIXED_VALUE_PLACEHOLDER,
} from './fieldBox';
import type { FieldSize } from './fieldBox';
import { useInvalidMessageBubble } from './useInvalidMessageBubble';
import { useTextEdit } from './useTextEdit';

export type TextFieldUpdateMode = 'live' | 'delayed';

export type TextFieldType = 'text' | 'password';

type NativeInputProps = Omit<
  ComponentPropsWithRef<'input'>,
  'style' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'children' | 'size' | 'aria-invalid'
>;

interface TextFieldProps extends NativeInputProps {
  readonly value: string;
  readonly onValueChange?: ValueChangeHandler<string> | undefined;
  readonly updateMode?: TextFieldUpdateMode | undefined;
  readonly validate?: ((text: string) => string | undefined) | undefined;
  readonly mixed?: boolean | undefined;
  readonly type?: TextFieldType;
  readonly size?: FieldSize;
}

export function TextField({
  value,
  onValueChange,
  updateMode = 'delayed',
  validate,
  mixed = false,
  type = 'text',
  size = 'md',
  className,
  ref,
  tabIndex,
  onFocus,
  onBlur,
  onKeyDown,
  placeholder,
  'aria-describedby': ariaDescribedBy,
  ...inputProps
}: TextFieldProps) {
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
  const edit = useTextEdit({ value, mixed, live: updateMode === 'live', onValueChange, validate });
  const { setAnchorRef, describedBy, bubble } = useInvalidMessageBubble(edit.invalidMessage);
  const showsMixed = mixed && !edit.editing;

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    onKeyDown?.(event);

    if (event.defaultPrevented || event.nativeEvent.isComposing) {
      return;
    }

    if (event.key === 'Enter') {
      edit.commit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      edit.cancel();
      event.currentTarget.blur();
    }
  }

  function focusInputOnBoxPress(event: MouseEvent<HTMLSpanElement>): void {
    if (event.target === event.currentTarget && inputRef.current !== null) {
      event.preventDefault();
      inputRef.current.focus();
    }
  }

  return (
    <>
      <span
        ref={setAnchorRef}
        className={fieldBoxClassName({
          size,
          invalid: edit.invalidMessage !== undefined,
          disabled,
          readOnly,
          className,
        })}
        onMouseDown={focusInputOnBoxPress}
      >
        <input
          {...inputProps}
          {...rovingProps}
          className={fieldInputClassName}
          type={type}
          value={showsMixed ? '' : edit.text}
          placeholder={showsMixed ? MIXED_VALUE_PLACEHOLDER : placeholder}
          aria-invalid={edit.invalidMessage === undefined ? undefined : true}
          aria-describedby={joinIds(ariaDescribedBy, describedBy)}
          onChange={(event) => {
            edit.change(event.currentTarget.value);
          }}
          onKeyDown={handleKeyDown}
          onBlur={(event) => {
            onBlur?.(event);
            edit.commit();
          }}
        />
      </span>
      {bubble !== null && <TooltipBubble {...bubble} />}
    </>
  );
}
