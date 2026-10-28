import type { IconSource } from '@/icons/icon';
import type { ButtonSize } from '@/ui/button/buttonClassName';
import { classNames } from '@/ui/classNames';
import { RovingFocusContext } from '@/ui/rovingFocus/rovingFocusContext';
import { useRovingFocusGroup } from '@/ui/rovingFocus/useRovingFocusGroup';
import { ToggleButton } from '@/ui/toggleButton/ToggleButton';
import type { ToggleButtonVariant } from '@/ui/toggleButton/ToggleButton';
import styles from './ToggleButtonGroup.module.css';
import { isOptionSelected, toggleMultipleValue } from './toggleButtonGroupValue';

export interface ToggleButtonGroupOption<T extends string> {
  readonly value: T;
  readonly label: string;
  readonly icon?: IconSource;
  readonly iconOnly?: boolean;
  readonly lang?: string;
  readonly disabled?: boolean;
}

interface ToggleButtonGroupBaseProps<T extends string> {
  readonly label: string;
  readonly options: readonly ToggleButtonGroupOption<T>[];
  readonly variant?: ToggleButtonVariant;
  readonly size?: ButtonSize;
  readonly disabled?: boolean;
  readonly className?: string;
}

interface SingleSelectionProps<T extends string> extends ToggleButtonGroupBaseProps<T> {
  readonly selection: 'single';
  readonly value: NoInfer<T>;
  readonly onValueChange: (value: NoInfer<T>) => void;
}

interface OptionalSelectionProps<T extends string> extends ToggleButtonGroupBaseProps<T> {
  readonly selection: 'optional';
  readonly value: NoInfer<T> | null;
  readonly onValueChange: (value: NoInfer<T> | null) => void;
}

interface MultipleSelectionProps<T extends string> extends ToggleButtonGroupBaseProps<T> {
  readonly selection: 'multiple';
  readonly value: readonly NoInfer<T>[];
  readonly onValueChange: (value: readonly NoInfer<T>[]) => void;
}

type ToggleButtonGroupProps<T extends string> =
  SingleSelectionProps<T> | OptionalSelectionProps<T> | MultipleSelectionProps<T>;

function pressOption<T extends string>(
  props: ToggleButtonGroupProps<T>,
  option: T,
  pressed: boolean,
): void {
  switch (props.selection) {
    case 'single':
      if (pressed) {
        props.onValueChange(option);
      }
      return;
    case 'optional':
      props.onValueChange(pressed ? option : null);
      return;
    case 'multiple':
      props.onValueChange(
        toggleMultipleValue(
          props.value,
          option,
          pressed,
          props.options.map((candidate) => candidate.value),
        ),
      );
      return;
  }
}

export function ToggleButtonGroup<T extends string>(props: ToggleButtonGroupProps<T>) {
  const { label, options, variant = 'default', size = 'md', disabled = false, className } = props;
  const { registry, onKeyDown } = useRovingFocusGroup({
    orientation: 'horizontal',
    joinParentGroup: true,
  });

  return (
    <RovingFocusContext value={registry}>
      <div
        className={classNames(styles.root, className)}
        role="group"
        aria-label={label}
        onKeyDown={onKeyDown}
      >
        {options.map((option) => {
          const shared = {
            pressed: isOptionSelected(props, option.value),
            onPressedChange: (pressed: boolean) => {
              pressOption(props, option.value, pressed);
            },
            variant,
            size,
            disabled: disabled || option.disabled === true,
            lang: option.lang,
          };

          return option.iconOnly === true && option.icon !== undefined ? (
            <ToggleButton key={option.value} {...shared} icon={option.icon} label={option.label} />
          ) : (
            <ToggleButton key={option.value} {...shared} icon={option.icon}>
              {option.label}
            </ToggleButton>
          );
        })}
      </div>
    </RovingFocusContext>
  );
}
