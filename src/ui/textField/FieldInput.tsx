import { useEffect, useRef } from 'react';
import type { ComponentPropsWithRef, KeyboardEvent, MouseEvent } from 'react';
import { VALUE_EDIT_ATTRIBUTE } from '@/contracts/valueChange';
import type { ValueChangeHandler, ValueEditState } from '@/contracts/valueChange';
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
import type { TextReading } from './textEditSession';
import { useInvalidMessageBubble } from './useInvalidMessageBubble';
import { useTextEdit } from './useTextEdit';

export type FieldInputType = 'text' | 'password';

export type FieldNativeInputProps = Omit<
  ComponentPropsWithRef<'input'>,
  'style' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'children' | 'size' | 'aria-invalid'
>;

interface FieldInputProps<T> extends FieldNativeInputProps {
  readonly value: T;
  readonly onValueChange: ValueChangeHandler<T> | undefined;
  readonly live: boolean;
  readonly mixed: boolean;
  readonly type: FieldInputType;
  readonly size: FieldSize;
  readonly format: (value: T) => string;
  readonly read: (text: string) => TextReading<T>;
  readonly accepts?: ((text: string) => boolean) | undefined;
  readonly keyEdit?:
    ((event: KeyboardEvent<HTMLInputElement>, text: string) => string | undefined) | undefined;
}

function insertedText(input: HTMLInputElement, data: string): string {
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? start;

  return input.value.slice(0, start) + data + input.value.slice(end);
}

export function FieldInput<T>({
  value,
  onValueChange,
  live,
  mixed,
  type,
  size,
  format,
  read,
  accepts,
  keyEdit,
  className,
  ref,
  tabIndex,
  onFocus,
  onBlur,
  onKeyDown,
  placeholder,
  'aria-describedby': ariaDescribedBy,
  ...inputProps
}: FieldInputProps<T>) {
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
  const edit = useTextEdit({ value, mixed, live, onValueChange, format, read });
  const { setAnchorRef, describedBy, bubble } = useInvalidMessageBubble(edit.invalidMessage);
  const showsMixed = mixed && !edit.editing;
  const text = showsMixed ? '' : edit.text;
  const editState: ValueEditState = edit.dirty ? 'uncommitted' : 'committed';

  useEffect(() => {
    const input = inputRef.current;

    if (input === null || accepts === undefined) {
      return undefined;
    }

    function rejectInvalidInput(event: InputEvent): void {
      if (input !== null && event.data !== null && !accepts?.(insertedText(input, event.data))) {
        event.preventDefault();
      }
    }

    input.addEventListener('beforeinput', rejectInvalidInput);

    return () => {
      input.removeEventListener('beforeinput', rejectInvalidInput);
    };
  }, [accepts]);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    onKeyDown?.(event);

    if (event.defaultPrevented || event.nativeEvent.isComposing) {
      return;
    }

    const replacement = readOnly ? undefined : keyEdit?.(event, text);

    if (replacement !== undefined) {
      event.preventDefault();
      edit.replace(replacement);
    } else if (event.key === 'Enter') {
      edit.commit();
    } else if (event.key === 'Escape') {
      event.preventDefault();

      if (edit.cancel()) {
        event.stopPropagation();
      }

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
          {...{ [VALUE_EDIT_ATTRIBUTE]: editState }}
          className={fieldInputClassName}
          type={type}
          value={text}
          placeholder={showsMixed ? MIXED_VALUE_PLACEHOLDER : placeholder}
          aria-invalid={edit.invalidMessage === undefined ? undefined : true}
          aria-describedby={joinIds(ariaDescribedBy, describedBy)}
          onChange={(event) => {
            const draft = event.currentTarget.value;

            if (accepts === undefined || accepts(draft)) {
              edit.change(draft);
            }
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
