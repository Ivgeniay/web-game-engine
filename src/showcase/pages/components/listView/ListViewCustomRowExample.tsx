import { frameworkIcons } from '@/icons/frameworkIcons';
import { ListRowContent } from '@/ui/listView/ListRowContent';
import { ListView } from '@/ui/listView/ListView';
import type { ListRowState } from '@/ui/listView/ListView';
import { useListViewState } from '@/ui/listView/useListViewState';
import styles from './ListViewCustomRowExample.module.css';

const LIST_LABEL = 'Build log';

type LogLevel = 'info' | 'warning' | 'error';

interface LogEntry {
  readonly message: string;
  readonly level: LogLevel;
  readonly time: string;
}

const LOG: Readonly<Record<string, LogEntry>> = {
  'log-1': { message: 'Build started', level: 'info', time: '12:00:01' },
  'log-2': { message: 'Texture is not power of two', level: 'warning', time: '12:00:03' },
  'log-3': { message: 'Shader compiled', level: 'info', time: '12:00:04' },
  'log-4': { message: 'Missing script on Player', level: 'error', time: '12:00:06' },
  'log-5': { message: 'Build finished', level: 'info', time: '12:00:09' },
};

const LOG_IDS = Object.keys(LOG);

const LEVEL_ICONS = {
  info: frameworkIcons.info,
  warning: frameworkIcons.warning,
  error: frameworkIcons.error,
} as const;

function logMessage(id: string): string {
  return LOG[id]?.message ?? id;
}

function renderLogRow({ id, label }: ListRowState) {
  const entry = LOG[id];

  return (
    <>
      <ListRowContent
        label={label}
        icon={entry === undefined ? undefined : LEVEL_ICONS[entry.level]}
      />
      <span className={styles.time}>{entry?.time}</span>
    </>
  );
}

export function ListViewCustomRowExample() {
  const state = useListViewState();

  return (
    <ListView
      aria-label={LIST_LABEL}
      className={styles.list}
      itemIds={LOG_IDS}
      getLabel={logMessage}
      renderRow={renderLogRow}
      {...state}
    />
  );
}
