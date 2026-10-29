import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import type { ComponentPropsWithRef, KeyboardEvent } from 'react';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { isModPressed } from '@/ui/platform/modifierKey';
import { useIsMacPlatform } from '@/ui/platform/useIsMacPlatform';
import type { FieldSize } from '@/ui/textField/fieldBox';
import type { TextFieldUpdateMode } from '@/ui/textField/TextField';
import type { TextReading } from '@/ui/textField/textEditSession';
import { useFieldInput } from '@/ui/textField/useFieldInput';
import { TooltipBubble } from '@/ui/tooltip/TooltipBubble';
import { useMergedRefs } from '@/ui/useMergedRefs';

type TextAreaNativeProps = Omit<
  ComponentPropsWithRef<'textarea'>,
  'style' | 'value' | 'defaultValue' | 'onChange' | 'children' | 'rows' | 'cols' | 'aria-invalid'
>;

interface TextAreaProps extends TextAreaNativeProps {
  readonly value: string;
  readonly onValueChange?: ValueChangeHandler<string> | undefined;
  readonly updateMode?: TextFieldUpdateMode | undefined;
  readonly validate?: ((text: string) => string | undefined) | undefined;
  readonly mixed?: boolean | undefined;
  readonly minRows?: number | undefined;
  readonly maxRows?: number | undefined;
  readonly size?: FieldSize;
}

const DEFAULT_MIN_ROWS = 2;
const DEFAULT_MAX_ROWS = 8;
const AUTO_HEIGHT = 'auto';

function formatText(text: string): string {
  return text;
}

function fitHeight(element: HTMLTextAreaElement, maxRows: number): void {
  element.style.height = AUTO_HEIGHT;
  const lineHeight = Number.parseFloat(getComputedStyle(element).lineHeight);
  const maxHeight = Number.isFinite(lineHeight) ? lineHeight * maxRows : Infinity;
  element.style.height = `${String(Math.min(element.scrollHeight, maxHeight))}px`;
}

export function TextArea({
  value,
  onValueChange,
  updateMode = 'delayed',
  validate,
  mixed = false,
  minRows = DEFAULT_MIN_ROWS,
  maxRows = DEFAULT_MAX_ROWS,
  size = 'md',
  className,
  ref,
  tabIndex,
  onFocus,
  onBlur,
  onKeyDown,
  placeholder,
  'aria-describedby': describedBy,
  ...textAreaProps
}: TextAreaProps) {
  const isMac = useIsMacPlatform();
  const elementRef = useRef<HTMLTextAreaElement>(null);
  const mergedRef = useMergedRefs(ref, elementRef);

  const read = useCallback(
    (text: string): TextReading<string> => {
      const message = validate?.(text);

      return message === undefined
        ? { valid: true, value: text }
        : { valid: false, message, fallback: undefined };
    },
    [validate],
  );
  const isCommitKey = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) =>
      event.key === 'Enter' && isModPressed(event, isMac),
    [isMac],
  );

  const { boxProps, controlProps, bubble } = useFieldInput<string, HTMLTextAreaElement>({
    value,
    onValueChange,
    live: updateMode === 'live',
    mixed,
    size,
    multiline: true,
    format: formatText,
    read,
    accepts: undefined,
    keyEdit: undefined,
    isCommitKey,
    disabled: textAreaProps.disabled ?? false,
    readOnly: textAreaProps.readOnly ?? false,
    placeholder,
    describedBy,
    className,
    ref: mergedRef,
    tabIndex,
    onFocus,
    onBlur,
    onKeyDown,
  });

  useLayoutEffect(() => {
    if (elementRef.current !== null) {
      fitHeight(elementRef.current, maxRows);
    }
  }, [controlProps.value, controlProps.placeholder, minRows, maxRows]);

  useEffect(() => {
    const element = elementRef.current;

    if (element === null) {
      return undefined;
    }

    let width = element.clientWidth;
    const observer = new ResizeObserver(() => {
      if (element.clientWidth !== width) {
        width = element.clientWidth;
        fitHeight(element, maxRows);
      }
    });
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [maxRows]);

  return (
    <>
      <span {...boxProps}>
        <textarea {...textAreaProps} {...controlProps} rows={minRows} />
      </span>
      {bubble !== null && <TooltipBubble {...bubble} />}
    </>
  );
}
