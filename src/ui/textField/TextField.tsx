import { useCallback } from 'react';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import type { FieldSize } from './fieldBox';
import { FieldInput } from './FieldInput';
import type { FieldInputType, FieldNativeInputProps } from './FieldInput';
import type { TextReading } from './textEditSession';

export type TextFieldUpdateMode = 'live' | 'delayed';

interface TextFieldProps extends FieldNativeInputProps {
  readonly value: string;
  readonly onValueChange?: ValueChangeHandler<string> | undefined;
  readonly updateMode?: TextFieldUpdateMode | undefined;
  readonly validate?: ((text: string) => string | undefined) | undefined;
  readonly mixed?: boolean | undefined;
  readonly type?: FieldInputType;
  readonly size?: FieldSize;
}

function formatText(text: string): string {
  return text;
}

export function TextField({
  updateMode = 'delayed',
  validate,
  mixed = false,
  type = 'text',
  size = 'md',
  ...fieldProps
}: TextFieldProps) {
  const read = useCallback(
    (text: string): TextReading<string> => {
      const message = validate?.(text);

      return message === undefined
        ? { valid: true, value: text }
        : { valid: false, message, fallback: undefined };
    },
    [validate],
  );

  return (
    <FieldInput
      {...fieldProps}
      onValueChange={fieldProps.onValueChange}
      live={updateMode === 'live'}
      mixed={mixed}
      type={type}
      size={size}
      format={formatText}
      read={read}
    />
  );
}
