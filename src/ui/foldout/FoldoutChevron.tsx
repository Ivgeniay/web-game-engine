import { frameworkIcons } from '@/icons/frameworkIcons';
import { Icon } from '@/ui/icon/Icon';
import styles from './FoldoutChevron.module.css';

interface FoldoutChevronProps {
  readonly expanded: boolean;
}

export function FoldoutChevron({ expanded }: FoldoutChevronProps) {
  return (
    <span className={styles.root}>
      <Icon
        icon={expanded ? frameworkIcons['chevron-down'] : frameworkIcons['chevron-right']}
        size="sm"
      />
    </span>
  );
}
