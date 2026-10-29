import { useRef } from 'react';
import type { Ref } from 'react';
import type { Color } from '@/contracts/color';
import type { ValueChangeHandler, ValueChangePhase } from '@/contracts/valueChange';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { classNames } from '@/ui/classNames';
import checker from '@/ui/color/checker.module.css';
import { cssColor, parseHex } from '@/ui/color/colorModel';
import { isEyeDropperSupported, pickScreenColor } from '@/ui/color/eyeDropper';
import type { ColorMode } from '@/ui/colorPicker/colorChannels';
import { ColorPicker } from '@/ui/colorPicker/ColorPicker';
import type { ColorPickerLabels } from '@/ui/colorPicker/colorPickerLabels';
import { IconButton } from '@/ui/iconButton/IconButton';
import { Popover } from '@/ui/popover/Popover';
import type { PopoverOpenChangeReason, PopoverTriggerProps } from '@/ui/popover/Popover';
import { useRovingFocusItem } from '@/ui/rovingFocus/useRovingFocusItem';
import { MIXED_VALUE_PLACEHOLDER } from '@/ui/textField/fieldBox';
import { useMergedRefs } from '@/ui/useMergedRefs';
import styles from './ColorField.module.css';

export interface ColorFieldLabels extends ColorPickerLabels {
  readonly picker: string;
}

interface ColorFieldBaseProps {
  readonly value: Color;
  readonly onValueChange?: ValueChangeHandler<Color> | undefined;
  readonly mixed?: boolean | undefined;
  readonly showAlpha?: boolean | undefined;
  readonly disabled?: boolean | undefined;
  readonly colorMode?: ColorMode | undefined;
  readonly onColorModeChange?: ((mode: ColorMode) => void) | undefined;
  readonly labels: ColorFieldLabels;
  readonly id?: string | undefined;
  readonly className?: string | undefined;
  readonly ref?: Ref<HTMLButtonElement> | undefined;
}

interface ColorFieldAriaLabel {
  readonly 'aria-label': string;
  readonly 'aria-labelledby'?: never;
}

interface ColorFieldAriaLabelledBy {
  readonly 'aria-label'?: never;
  readonly 'aria-labelledby': string;
}

type ColorFieldProps = ColorFieldBaseProps & (ColorFieldAriaLabel | ColorFieldAriaLabelledBy);

interface SwatchProps {
  readonly triggerProps: PopoverTriggerProps;
  readonly value: Color;
  readonly mixed: boolean;
  readonly showAlpha: boolean;
  readonly disabled: boolean;
  readonly id: string | undefined;
  readonly ref: Ref<HTMLButtonElement> | undefined;
  readonly 'aria-label': string | undefined;
  readonly 'aria-labelledby': string | undefined;
}

interface PickSession {
  readonly start: Color;
  readonly last: Color;
  readonly previewed: boolean;
}

const PERCENT = 100;
const OPAQUE = 1;

function Swatch({
  triggerProps: { ref: setReference, ...referenceProps },
  value,
  mixed,
  showAlpha,
  disabled,
  id,
  ref,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: SwatchProps) {
  const triggerRef = useMergedRefs<HTMLButtonElement>(ref, setReference);
  const { ref: rovingRef, ...rovingProps } = useRovingFocusItem({
    ref: triggerRef,
    tabIndex: undefined,
    onFocus: undefined,
    disabled,
    preferred: false,
  });

  return (
    <button
      {...rovingProps}
      {...referenceProps}
      ref={rovingRef}
      id={id}
      type="button"
      disabled={disabled}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={styles.swatchButton}
    >
      {mixed ? (
        <span className={styles.mixed}>{MIXED_VALUE_PLACEHOLDER}</span>
      ) : (
        <span className={classNames(styles.swatch, checker.checker)}>
          <span className={styles.color} style={{ backgroundColor: cssColor(value) }} />
          {showAlpha && (
            <span className={styles.alphaBar}>
              <span
                className={styles.alphaFill}
                style={{ width: `${String(value.a * PERCENT)}%` }}
              />
            </span>
          )}
        </span>
      )}
    </button>
  );
}

export function ColorField({
  value,
  onValueChange,
  mixed = false,
  showAlpha = true,
  disabled = false,
  colorMode,
  onColorModeChange,
  labels,
  id,
  className,
  ref,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: ColorFieldProps) {
  const sessionRef = useRef<PickSession | null>(null);
  const eyeDropperSupported = isEyeDropperSupported();

  function emit(color: Color, phase: ValueChangePhase): void {
    onValueChange?.(showAlpha ? color : { ...color, a: OPAQUE }, phase);
  }

  function handleOpenChange(open: boolean, reason: PopoverOpenChangeReason): void {
    if (open) {
      sessionRef.current = { start: value, last: value, previewed: false };
      return;
    }

    const session = sessionRef.current;
    sessionRef.current = null;

    if (session === null || !session.previewed) {
      return;
    }

    if (reason === 'escape') {
      emit(session.start, 'cancel');
    } else {
      emit(session.last, 'commit');
    }
  }

  function handlePickerChange(color: Color): void {
    const session = sessionRef.current;

    if (session !== null) {
      sessionRef.current = { ...session, last: color, previewed: true };
    }

    emit(color, 'preview');
  }

  function pickFromScreen(): void {
    void pickScreenColor().then((hex) => {
      const picked = hex === undefined ? undefined : parseHex(hex, value.a);

      if (picked !== undefined) {
        emit(picked, 'commit');
      }
    });
  }

  return (
    <div className={classNames(styles.root, className)}>
      <Popover
        label={labels.picker}
        onOpenChange={handleOpenChange}
        trigger={(triggerProps) => (
          <Swatch
            triggerProps={triggerProps}
            value={value}
            mixed={mixed}
            showAlpha={showAlpha}
            disabled={disabled}
            id={id}
            ref={ref}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
          />
        )}
      >
        <ColorPicker
          value={value}
          showAlpha={showAlpha}
          colorMode={colorMode}
          onColorModeChange={onColorModeChange}
          labels={labels}
          onValueChange={handlePickerChange}
        />
      </Popover>
      {eyeDropperSupported && (
        <IconButton
          label={labels.eyedropper}
          icon={frameworkIcons.eyedropper}
          disabled={disabled}
          onClick={pickFromScreen}
        />
      )}
    </div>
  );
}
