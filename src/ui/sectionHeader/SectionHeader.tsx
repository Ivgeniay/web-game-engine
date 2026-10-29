import type { ComponentPropsWithRef, KeyboardEvent, ReactNode } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { classNames } from '@/ui/classNames';
import { FoldoutChevron } from '@/ui/foldout/FoldoutChevron';
import { FoldoutContext } from '@/ui/foldout/foldoutContext';
import headerStyles from '@/ui/foldout/foldoutHeader.module.css';
import { useFoldout } from '@/ui/foldout/useFoldout';
import { IconButton } from '@/ui/iconButton/IconButton';
import { Menu } from '@/ui/menu/Menu';
import type { MenuItem } from '@/ui/menu/menuItems';
import { useRovingFocusItem } from '@/ui/rovingFocus/useRovingFocusItem';
import styles from './SectionHeader.module.css';

type NativeButtonProps = Omit<
  ComponentPropsWithRef<'button'>,
  'style' | 'type' | 'children' | 'onClick' | 'aria-expanded' | 'aria-controls' | 'className'
>;

type SectionMenuProps =
  | { readonly menuItems: readonly MenuItem[]; readonly menuLabel: string }
  | { readonly menuItems?: never; readonly menuLabel?: never };

type SectionHeaderProps = NativeButtonProps &
  SectionMenuProps & {
    readonly label: string;
    readonly expanded: boolean;
    readonly onExpandedChange: (expanded: boolean) => void;
    readonly children: ReactNode;
    readonly className?: string | undefined;
  };

export function SectionHeader({
  label,
  expanded,
  onExpandedChange,
  children,
  menuItems,
  menuLabel,
  className,
  ref,
  tabIndex,
  onFocus,
  onKeyDown,
  disabled,
  ...buttonProps
}: SectionHeaderProps) {
  const foldout = useFoldout({ expanded, onExpandedChange });
  const roving = useRovingFocusItem<HTMLButtonElement>({
    ref,
    tabIndex,
    onFocus,
    disabled: disabled ?? false,
    preferred: false,
  });

  return (
    <div className={classNames(styles.root, className)}>
      <div className={styles.header}>
        <button
          {...buttonProps}
          {...roving}
          type="button"
          className={classNames(headerStyles.header, styles.toggle)}
          disabled={disabled}
          aria-expanded={expanded}
          aria-controls={foldout.contentId}
          onClick={foldout.toggle}
          onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
            onKeyDown?.(event);

            if (!event.defaultPrevented) {
              foldout.handleKeyDown(event);
            }
          }}
        >
          <FoldoutChevron expanded={expanded} />
          <span className={headerStyles.label}>{label}</span>
        </button>
        {menuItems !== undefined && (
          <Menu
            items={menuItems}
            trigger={(triggerProps) => (
              <IconButton
                {...triggerProps}
                size="sm"
                label={menuLabel}
                icon={frameworkIcons['more-vertical']}
                disabled={disabled}
              />
            )}
          />
        )}
      </div>
      <FoldoutContext value={foldout.broadcast}>
        <div id={foldout.contentId} className={styles.content} hidden={!expanded}>
          {children}
        </div>
      </FoldoutContext>
    </div>
  );
}
