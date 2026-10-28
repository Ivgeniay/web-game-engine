import type { ComponentPropsWithRef } from 'react';
import type { IconSource } from '@/icons/icon';
import { BUTTON_ICON_SIZES, buttonClassName } from '@/ui/button/buttonClassName';
import type { ButtonSize, ButtonVariant } from '@/ui/button/buttonClassName';
import { Icon } from '@/ui/icon/Icon';

type NativeButtonProps = Omit<
  ComponentPropsWithRef<'button'>,
  'style' | 'type' | 'children' | 'aria-label' | 'title'
>;

interface IconButtonProps extends NativeButtonProps {
  readonly label: string;
  readonly icon: IconSource;
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
}

export function IconButton({
  label,
  icon,
  variant = 'flat',
  size = 'md',
  className,
  ...buttonProps
}: IconButtonProps) {
  return (
    <button
      {...buttonProps}
      type="button"
      className={buttonClassName({ variant, size, shape: 'square', className })}
      aria-label={label}
      title={label}
    >
      <Icon icon={icon} size={BUTTON_ICON_SIZES[size]} />
    </button>
  );
}
