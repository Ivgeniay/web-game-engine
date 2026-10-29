import { useRef, useState } from 'react';
import type { KeyboardEvent, Ref } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import type { IconSource } from '@/icons/icon';
import { Button } from '@/ui/button/Button';
import type { ButtonSize, ButtonVariant } from '@/ui/button/buttonClassName';
import { classNames } from '@/ui/classNames';
import { useMergedRefs } from '@/ui/useMergedRefs';
import { IconButton } from '@/ui/iconButton/IconButton';
import { Menu } from '@/ui/menu/Menu';
import type { MenuItem } from '@/contracts/menu';
import styles from './SplitButton.module.css';

interface SplitButtonProps {
  readonly label: string;
  readonly icon?: IconSource | undefined;
  readonly onClick: () => void;
  readonly menuLabel: string;
  readonly menuItems: readonly MenuItem[];
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly disabled?: boolean | undefined;
  readonly className?: string | undefined;
  readonly ref?: Ref<HTMLButtonElement> | undefined;
}

export function SplitButton({
  label,
  icon,
  onClick,
  menuLabel,
  menuItems,
  variant = 'default',
  size = 'md',
  disabled = false,
  className,
  ref,
}: SplitButtonProps) {
  const [open, setOpen] = useState(false);
  const [openedFromMain, setOpenedFromMain] = useState(false);
  const mainRef = useRef<HTMLButtonElement>(null);
  const mergedMainRef = useMergedRefs(ref, mainRef);
  const iconProps = icon === undefined ? {} : { icon };

  function openMenuFromKeyboard(event: KeyboardEvent<HTMLButtonElement>): void {
    if (event.altKey && event.key === 'ArrowDown') {
      event.preventDefault();
      setOpenedFromMain(true);
      setOpen(true);
    }
  }

  return (
    <div className={classNames(styles.root, styles[variant], className)}>
      <Button
        ref={mergedMainRef}
        variant={variant}
        size={size}
        {...iconProps}
        disabled={disabled}
        onClick={onClick}
        onKeyDown={openMenuFromKeyboard}
      >
        {label}
      </Button>
      <Menu
        items={menuItems}
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            setOpenedFromMain(false);
          }
          setOpen(nextOpen);
        }}
        returnFocusRef={openedFromMain ? mainRef : undefined}
        trigger={(triggerProps) => (
          <IconButton
            {...triggerProps}
            label={menuLabel}
            icon={frameworkIcons['chevron-down']}
            variant={variant}
            size={size}
            disabled={disabled}
          />
        )}
      />
    </div>
  );
}
