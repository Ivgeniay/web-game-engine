import type { IconSource } from '@/icons/icon';
import { Icon } from '@/ui/icon/Icon';
import styles from './ListRowContent.module.css';

export interface TextRange {
  readonly start: number;
  readonly length: number;
}

interface ListRowContentProps {
  readonly label: string;
  readonly icon?: IconSource | undefined;
  readonly highlight?: TextRange | null | undefined;
}

function renderLabel(label: string, highlight: TextRange | null | undefined) {
  if (highlight === null || highlight === undefined || highlight.length === 0) {
    return label;
  }

  const end = highlight.start + highlight.length;

  return (
    <>
      {label.slice(0, highlight.start)}
      <mark className={styles.match}>{label.slice(highlight.start, end)}</mark>
      {label.slice(end)}
    </>
  );
}

export function ListRowContent({ label, icon, highlight }: ListRowContentProps) {
  return (
    <span className={styles.root}>
      {icon !== undefined && (
        <span className={styles.icon}>
          <Icon icon={icon} />
        </span>
      )}
      <span className={styles.label} data-list-row-label="">
        {renderLabel(label, highlight)}
      </span>
    </span>
  );
}
