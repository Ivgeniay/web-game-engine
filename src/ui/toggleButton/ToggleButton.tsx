import type { ComponentPropsWithRef } from 'react';
import type { IconSource } from '@/icons/icon';
import {
  BUTTON_ICON_SIZES,
  buttonClassName,
  buttonLabelClassName,
} from '@/ui/button/buttonClassName';
import type { ButtonSize, ButtonVariant } from '@/ui/button/buttonClassName';
import { disabledButtonProps } from '@/ui/button/disabledButton';
import { classNames } from '@/ui/classNames';
import { Icon } from '@/ui/icon/Icon';
import { useRovingFocusItem } from '@/ui/rovingFocus/useRovingFocusItem';
import { TooltipBubble } from '@/ui/tooltip/TooltipBubble';
import { useTooltip } from '@/ui/tooltip/useTooltip';
import { useMergedRefs } from '@/ui/useMergedRefs';
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
  readonly focusableWhenDisabled?: boolean | undefined;
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
  disabled,
  focusableWhenDisabled,
  ...buttonProps
}: ToggleButtonProps) {
  const disabledProps = disabledButtonProps({
    disabled,
    focusableWhenDisabled,
    onClick: () => {
      onPressedChange(!pressed);
    },
  });
  const tooltip = useTooltip({
    content: label ?? '',
    describe: false,
    disabled: label === undefined,
  });
  const triggerRef = useMergedRefs(ref, tooltip.setTriggerRef);
  const { ref: rovingRef, ...rovingProps } = useRovingFocusItem({
    ref: triggerRef,
    tabIndex,
    onFocus,
    disabled: disabledProps.disabled ?? false,
    preferred: pressed,
  });

  return (
    <>
      <button
        {...tooltip.getTriggerProps({ ...buttonProps, ...disabledProps, ...rovingProps })}
        ref={rovingRef}
        type="button"
        className={buttonClassName({
          variant,
          size,
          shape: children === undefined ? 'square' : 'text',
          className: classNames(styles.root, className),
        })}
        aria-pressed={pressed}
        aria-label={label}
      >
        {icon !== undefined && <Icon icon={icon} size={BUTTON_ICON_SIZES[size]} />}
        {children !== undefined && <span className={buttonLabelClassName}>{children}</span>}
      </button>
      {tooltip.bubble !== null && <TooltipBubble {...tooltip.bubble} />}
    </>
  );
}
