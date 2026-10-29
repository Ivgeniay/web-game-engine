import { useEffect, useRef } from 'react';
import type {
  ChangeEvent,
  FocusEvent,
  FocusEventHandler,
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEvent,
  Ref,
  RefCallback,
} from 'react';
import { VALUE_EDIT_ATTRIBUTE } from '@/contracts/valueChange';
import type { ValueChangeHandler, ValueEditState } from '@/contracts/valueChange';
import { useRovingFocusItem } from '@/ui/rovingFocus/useRovingFocusItem';
import type { TooltipBubbleProps } from '@/ui/tooltip/useTooltip';
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

export type FieldElement = HTMLInputElement | HTMLTextAreaElement;

export interface FieldInputOptions<T, E extends FieldElement> {
  readonly value: T;
  readonly onValueChange: ValueChangeHandler<T> | undefined;
  readonly live: boolean;
  readonly mixed: boolean;
  readonly size: FieldSize;
  readonly multiline: boolean;
  readonly format: (value: T) => string;
  readonly read: (text: string) => TextReading<T>;
  readonly accepts: ((text: string) => boolean) | undefined;
  readonly keyEdit: ((event: KeyboardEvent<E>, text: string) => string | undefined) | undefined;
  readonly isCommitKey: (event: KeyboardEvent<E>) => boolean;
  readonly disabled: boolean;
  readonly readOnly: boolean;
  readonly placeholder: string | undefined;
  readonly describedBy: string | undefined;
  readonly className: string | undefined;
  readonly ref: Ref<E> | undefined;
  readonly tabIndex: number | undefined;
  readonly onFocus: FocusEventHandler<E> | undefined;
  readonly onBlur: FocusEventHandler<E> | undefined;
  readonly onKeyDown: KeyboardEventHandler<E> | undefined;
}

export interface FieldBoxProps {
  readonly ref: (node: HTMLElement | null) => void;
  readonly className: string;
  readonly onMouseDown: (event: MouseEvent<HTMLSpanElement>) => void;
}

export interface FieldControlProps<E extends FieldElement> {
  readonly ref: RefCallback<E>;
  readonly tabIndex: number | undefined;
  readonly className: string | undefined;
  readonly value: string;
  readonly placeholder: string | undefined;
  readonly 'aria-invalid': true | undefined;
  readonly 'aria-describedby': string | undefined;
  readonly [VALUE_EDIT_ATTRIBUTE]: ValueEditState;
  readonly onFocus: FocusEventHandler<E>;
  readonly onChange: (event: ChangeEvent<E>) => void;
  readonly onKeyDown: (event: KeyboardEvent<E>) => void;
  readonly onBlur: (event: FocusEvent<E>) => void;
}

export interface FieldInputParts<E extends FieldElement> {
  readonly boxProps: FieldBoxProps;
  readonly controlProps: FieldControlProps<E>;
  readonly bubble: TooltipBubbleProps | null;
}

function insertedText(input: FieldElement, data: string): string {
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? start;

  return input.value.slice(0, start) + data + input.value.slice(end);
}

export function useFieldInput<T, E extends FieldElement>({
  value,
  onValueChange,
  live,
  mixed,
  size,
  multiline,
  format,
  read,
  accepts,
  keyEdit,
  isCommitKey,
  disabled,
  readOnly,
  placeholder,
  describedBy: ariaDescribedBy,
  className,
  ref,
  tabIndex,
  onFocus,
  onBlur,
  onKeyDown,
}: FieldInputOptions<T, E>): FieldInputParts<E> {
  const elementRef = useRef<E>(null);
  const mergedRef = useMergedRefs(ref, elementRef);
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
    const current = elementRef.current;

    if (current === null || accepts === undefined) {
      return undefined;
    }

    const field: FieldElement = current;
    const element: HTMLElement = current;

    function rejectInvalidInput(event: InputEvent): void {
      if (event.data !== null && !accepts?.(insertedText(field, event.data))) {
        event.preventDefault();
      }
    }

    element.addEventListener('beforeinput', rejectInvalidInput);

    return () => {
      element.removeEventListener('beforeinput', rejectInvalidInput);
    };
  }, [accepts]);

  function handleKeyDown(event: KeyboardEvent<E>): void {
    onKeyDown?.(event);

    if (event.defaultPrevented || event.nativeEvent.isComposing) {
      return;
    }

    const replacement = readOnly ? undefined : keyEdit?.(event, text);

    if (replacement !== undefined) {
      event.preventDefault();
      edit.replace(replacement);
    } else if (isCommitKey(event)) {
      if (multiline) {
        event.preventDefault();
      }

      edit.commit();
    } else if (event.key === 'Escape') {
      event.preventDefault();

      if (edit.cancel()) {
        event.stopPropagation();
      }

      event.currentTarget.blur();
    }
  }

  function focusControlOnBoxPress(event: MouseEvent<HTMLSpanElement>): void {
    if (event.target === event.currentTarget && elementRef.current !== null) {
      event.preventDefault();
      elementRef.current.focus();
    }
  }

  return {
    boxProps: {
      ref: setAnchorRef,
      className: fieldBoxClassName({
        size,
        multiline,
        invalid: edit.invalidMessage !== undefined,
        disabled,
        readOnly,
        className,
      }),
      onMouseDown: focusControlOnBoxPress,
    },
    controlProps: {
      ...rovingProps,
      [VALUE_EDIT_ATTRIBUTE]: editState,
      className: fieldInputClassName,
      value: text,
      placeholder: showsMixed ? MIXED_VALUE_PLACEHOLDER : placeholder,
      'aria-invalid': edit.invalidMessage === undefined ? undefined : true,
      'aria-describedby': joinIds(ariaDescribedBy, describedBy),
      onChange: (event) => {
        const draft = event.currentTarget.value;

        if (accepts === undefined || accepts(draft)) {
          edit.change(draft);
        }
      },
      onKeyDown: handleKeyDown,
      onBlur: (event) => {
        onBlur?.(event);
        edit.commit();
      },
    },
    bubble,
  };
}
