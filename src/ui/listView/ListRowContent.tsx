import type { IconSource } from '@/icons/icon';
import { Icon } from '@/ui/icon/Icon';
import styles from './ListRowContent.module.css';

interface ListRowContentProps {
  readonly label: string;
  readonly icon?: IconSource | undefined;
}

export function ListRowContent({ label, icon }: ListRowContentProps) {
  return (
    <span className={styles.root}>
      {icon !== undefined && (
        <span className={styles.icon}>
          <Icon icon={icon} />
        </span>
      )}
      <span className={styles.label}>{label}</span>
    </span>
  );
}
