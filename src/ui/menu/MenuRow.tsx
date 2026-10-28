import { useListItem } from '@floating-ui/react';
import { useId } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import type { IconSource } from '@/icons/icon';
import styles from './Menu.module.css';
import { MenuRowContent } from './MenuRowContent';
import { useMenuLevelContext } from './useMenuLevelContext';

export type MenuRowRole = 'menuitem' | 'menuitemcheckbox' | 'menuitemradio';

interface MenuRowProps {
  readonly role: MenuRowRole;
  readonly label: string;
  readonly icon?: IconSource | undefined;
  readonly checked?: boolean | undefined;
  readonly shortcut?: string | undefined;
  readonly disabled?: boolean | undefined;
  readonly onSelect: () => void;
}

const ACTIVE_TAB_INDEX = 0;
const INACTIVE_TAB_INDEX = -1;

export function MenuRow({
  role,
  label,
  icon,
  checked,
  shortcut,
  disabled = false,
  onSelect,
}: MenuRowProps) {
  const level = useMenuLevelContext();
  const { ref: listItemRef, index: listItemIndex } = useListItem({
    label: disabled ? null : label,
  });
  const active = listItemIndex === level.activeIndex;
  const mark = checked === true ? frameworkIcons.check : icon;
  const shortcutId = useId();

  return (
    <button
      ref={listItemRef}
      type="button"
      role={role}
      aria-checked={role === 'menuitem' ? undefined : checked === true}
      className={styles.item}
      tabIndex={active ? ACTIVE_TAB_INDEX : INACTIVE_TAB_INDEX}
      disabled={disabled}
      data-active={active ? '' : undefined}
      aria-describedby={shortcut === undefined ? undefined : shortcutId}
      {...level.getItemProps({
        onClick() {
          onSelect();
          level.selectAndClose();
        },
      })}
    >
      <MenuRowContent
        label={label}
        mark={mark}
        shortcut={shortcut}
        shortcutId={shortcutId}
        active={active}
        hasSubmenu={false}
      />
    </button>
  );
}
