import { frameworkIcons } from '@/icons/frameworkIcons';
import type { IconSource } from '@/icons/icon';
import { Icon } from '@/ui/icon/Icon';
import { Kbd } from '@/ui/kbd/Kbd';
import styles from './Menu.module.css';

interface MenuRowContentProps {
  readonly label: string;
  readonly mark: IconSource | undefined;
  readonly shortcut: string | undefined;
  readonly shortcutId: string;
  readonly active: boolean;
  readonly hasSubmenu: boolean;
}

export function MenuRowContent({
  label,
  mark,
  shortcut,
  shortcutId,
  active,
  hasSubmenu,
}: MenuRowContentProps) {
  return (
    <>
      <span className={styles.mark}>{mark !== undefined && <Icon icon={mark} />}</span>
      <span className={styles.label}>{label}</span>
      {shortcut !== undefined && (
        <span id={shortcutId} className={styles.shortcut} aria-hidden="true">
          <Kbd tone={active ? 'primary' : 'secondary'}>{shortcut}</Kbd>
        </span>
      )}
      {hasSubmenu && (
        <span className={styles.submenuArrow}>
          <Icon icon={frameworkIcons['chevron-right']} />
        </span>
      )}
    </>
  );
}
