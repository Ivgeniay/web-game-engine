import { useSyncExternalStore } from 'react';
import { commonMessages } from '@/core/i18n/commonMessages';
import { STATUS_BAR_ZONES, statusBarZoneItems } from '@/core/statusBar/statusBarRegistry';
import type { StatusBarItem } from '@/core/statusBar/statusBarRegistry';
import { useMessages } from '@/state/language/useMessages';
import { useEditorRegistries } from '@/state/registries/registriesContext';
import { classNames } from '@/ui/classNames';
import styles from './StatusBar.module.css';

interface StatusBarProps {
  readonly className?: string | undefined;
}

export function StatusBar({ className }: StatusBarProps) {
  const { statusBar } = useEditorRegistries();
  const items = useSyncExternalStore(statusBar.subscribe, statusBar.getItems);
  const common = useMessages(commonMessages);

  return (
    <footer className={classNames(styles.root, className)} aria-label={common('statusBar')}>
      {STATUS_BAR_ZONES.map((zone) => (
        <div key={zone} className={classNames(styles.zone, styles[zone])}>
          {statusBarZoneItems(items, zone).map((item) => (
            <StatusBarItemView key={item.id} item={item} />
          ))}
        </div>
      ))}
    </footer>
  );
}

interface StatusBarItemViewProps {
  readonly item: StatusBarItem;
}

function StatusBarItemView({ item }: StatusBarItemViewProps) {
  const Component = item.component;

  return (
    <div className={styles.item} role={item.announce === true ? 'status' : undefined}>
      <Component />
    </div>
  );
}
