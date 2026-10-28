import type { ComponentPropsWithRef } from 'react';
import type { IconSource } from '@/icons/icon';
import { Icon } from '@/ui/icon/Icon';
import { useRovingFocusItem } from '@/ui/rovingFocus/useRovingFocusItem';
import { BUTTON_ICON_SIZES, buttonClassName, buttonLabelClassName } from './buttonClassName';
import type { ButtonSize, ButtonVariant } from './buttonClassName';
import { disabledButtonProps } from './disabledButton';

type NativeButtonProps = Omit<ComponentPropsWithRef<'button'>, 'style' | 'type' | 'children'>;

export type ButtonType = 'button' | 'submit';

interface ButtonProps extends NativeButtonProps {
  readonly children: string;
  readonly type?: ButtonType;
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly icon?: IconSource;
  readonly focusableWhenDisabled?: boolean | undefined;
}

export function Button({
  children,
  variant = 'default',
  size = 'md',
  icon,
  type = 'button',
  className,
  ref,
  tabIndex,
  onFocus,
  disabled,
  focusableWhenDisabled,
  onClick,
  ...buttonProps
}: ButtonProps) {
  const disabledProps = disabledButtonProps({ disabled, focusableWhenDisabled, onClick });
  const rovingProps = useRovingFocusItem({
    ref,
    tabIndex,
    onFocus,
    disabled: disabledProps.disabled ?? false,
    preferred: false,
  });

  return (
    <button
      {...buttonProps}
      {...disabledProps}
      {...rovingProps}
      type={type}
      className={buttonClassName({ variant, size, shape: 'text', className })}
    >
      {icon !== undefined && <Icon icon={icon} size={BUTTON_ICON_SIZES[size]} />}
      <span className={buttonLabelClassName}>{children}</span>
    </button>
  );
}
