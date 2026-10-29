import type { ComponentPropsWithRef, KeyboardEvent } from 'react';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { TooltipBubble } from '@/ui/tooltip/TooltipBubble';
import type { FieldSize } from './fieldBox';
import type { TextReading } from './textEditSession';
import { useFieldInput } from './useFieldInput';

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

function isEnterKey(event: KeyboardEvent<HTMLInputElement>): boolean {
  return event.key === 'Enter';
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
  'aria-describedby': describedBy,
  ...inputProps
}: FieldInputProps<T>) {
  const { boxProps, controlProps, bubble } = useFieldInput<T, HTMLInputElement>({
    value,
    onValueChange,
    live,
    mixed,
    size,
    multiline: false,
    format,
    read,
    accepts,
    keyEdit,
    isCommitKey: isEnterKey,
    disabled: inputProps.disabled ?? false,
    readOnly: inputProps.readOnly ?? false,
    placeholder,
    describedBy,
    className,
    ref,
    tabIndex,
    onFocus,
    onBlur,
    onKeyDown,
  });

  return (
    <>
      <span {...boxProps}>
        <input {...inputProps} {...controlProps} type={type} />
      </span>
      {bubble !== null && <TooltipBubble {...bubble} />}
    </>
  );
}
