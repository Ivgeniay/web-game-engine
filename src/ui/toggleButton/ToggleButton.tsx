import type { ComponentPropsWithRef } from 'react';
import type { IconSource } from '@/icons/icon';
import {
  BUTTON_ICON_SIZES,
  buttonClassName,
  buttonLabelClassName,
} from '@/ui/button/buttonClassName';
import type { ButtonSize, ButtonVariant } from '@/ui/button/buttonClassName';
import { classNames } from '@/ui/classNames';
import { Icon } from '@/ui/icon/Icon';
import { useRovingFocusItem } from '@/ui/rovingFocus/useRovingFocusItem';
import styles from './ToggleButton.module.css';

export type ToggleButtonVariant = Exclude<ButtonVariant, 'accent'>;

type NativeButtonProps = Omit<
  ComponentPropsWithRef<'button'>,
  'style' | 'type' | 'children' | 'onClick' | 'aria-pressed' | 'aria-label' | 'title'
>;

interface ToggleButtonBaseProps extends NativeButtonProps {
  readonly pressed: boolean;
  readonly onPressedChange: (pressed: boolean) => void;
  readonly variant?: ToggleButtonVariant;
  readonly size?: ButtonSize;
}

interface ToggleButtonTextContent {
  readonly children: string;
  readonly icon?: IconSource | undefined;
  readonly label?: never;
}

interface ToggleButtonIconContent {
  readonly label: string;
  readonly icon: IconSource;
  readonly children?: never;
}

type ToggleButtonProps = ToggleButtonBaseProps &
  (ToggleButtonTextContent | ToggleButtonIconContent);

export function ToggleButton({
  pressed,
  onPressedChange,
  variant = 'default',
  size = 'md',
  children,
  label,
  icon,
  className,
  ref,
  tabIndex,
  onFocus,
  ...buttonProps
}: ToggleButtonProps) {
  const rovingProps = useRovingFocusItem({
    ref,
    tabIndex,
    onFocus,
    disabled: buttonProps.disabled ?? false,
    preferred: pressed,
  });

  return (
    <button
      {...buttonProps}
      {...rovingProps}
      type="button"
      className={buttonClassName({
        variant,
        size,
        shape: children === undefined ? 'square' : 'text',
        className: classNames(styles.root, className),
      })}
      aria-pressed={pressed}
      aria-label={label}
      title={label}
      onClick={() => {
        onPressedChange(!pressed);
      }}
    >
      {icon !== undefined && <Icon icon={icon} size={BUTTON_ICON_SIZES[size]} />}
      {children !== undefined && <span className={buttonLabelClassName}>{children}</span>}
    </button>
  );
}
