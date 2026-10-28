import type { ComponentPropsWithRef } from 'react';
import type { IconSource } from '@/icons/icon';
import { BUTTON_ICON_SIZES, buttonClassName } from '@/ui/button/buttonClassName';
import type { ButtonSize, ButtonVariant } from '@/ui/button/buttonClassName';
import { disabledButtonProps } from '@/ui/button/disabledButton';
import { Icon } from '@/ui/icon/Icon';
import { useRovingFocusItem } from '@/ui/rovingFocus/useRovingFocusItem';
import { TooltipBubble } from '@/ui/tooltip/TooltipBubble';
import { useTooltip } from '@/ui/tooltip/useTooltip';
import { useMergedRefs } from '@/ui/useMergedRefs';

type NativeButtonProps = Omit<
  ComponentPropsWithRef<'button'>,
  'style' | 'type' | 'children' | 'aria-label' | 'title'
>;

interface IconButtonProps extends NativeButtonProps {
  readonly label: string;
  readonly icon: IconSource;
  readonly shortcut?: string | undefined;
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly focusableWhenDisabled?: boolean | undefined;
}

export function IconButton({
  label,
  icon,
  shortcut,
  variant = 'flat',
  size = 'md',
  className,
  ref,
  tabIndex,
  onFocus,
  disabled,
  focusableWhenDisabled,
  onClick,
  ...buttonProps
}: IconButtonProps) {
  const disabledProps = disabledButtonProps({ disabled, focusableWhenDisabled, onClick });
  const tooltip = useTooltip({ content: label, shortcut, describe: shortcut !== undefined });
  const triggerRef = useMergedRefs(ref, tooltip.setTriggerRef);
  const { ref: rovingRef, ...rovingProps } = useRovingFocusItem({
    ref: triggerRef,
    tabIndex,
    onFocus,
    disabled: disabledProps.disabled ?? false,
    preferred: false,
  });

  return (
    <>
      <button
        {...tooltip.getTriggerProps({ ...buttonProps, ...disabledProps, ...rovingProps })}
        ref={rovingRef}
        type="button"
        className={buttonClassName({ variant, size, shape: 'square', className })}
        aria-label={label}
      >
        <Icon icon={icon} size={BUTTON_ICON_SIZES[size]} />
      </button>
      {tooltip.bubble !== null && <TooltipBubble {...tooltip.bubble} />}
    </>
  );
}
