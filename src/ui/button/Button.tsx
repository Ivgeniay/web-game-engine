import type { ComponentPropsWithRef } from 'react';
import type { IconSource } from '@/icons/icon';
import { Icon } from '@/ui/icon/Icon';
import { useRovingFocusItem } from '@/ui/rovingFocus/useRovingFocusItem';
import { BUTTON_ICON_SIZES, buttonClassName, buttonLabelClassName } from './buttonClassName';
import type { ButtonSize, ButtonVariant } from './buttonClassName';

type NativeButtonProps = Omit<ComponentPropsWithRef<'button'>, 'style' | 'type' | 'children'>;

interface ButtonProps extends NativeButtonProps {
  readonly children: string;
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly icon?: IconSource;
}

export function Button({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className,
  ref,
  tabIndex,
  onFocus,
  ...buttonProps
}: ButtonProps) {
  const rovingProps = useRovingFocusItem({
    ref,
    tabIndex,
    onFocus,
    disabled: buttonProps.disabled ?? false,
    preferred: false,
  });

  return (
    <button
      {...buttonProps}
      {...rovingProps}
      type="button"
      className={buttonClassName({ variant, size, shape: 'text', className })}
    >
      {icon !== undefined && <Icon icon={icon} size={BUTTON_ICON_SIZES[size]} />}
      <span className={buttonLabelClassName}>{children}</span>
    </button>
  );
}
