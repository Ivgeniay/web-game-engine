import { ListView } from '@/ui/listView/ListView';
import { useListViewState } from '@/ui/listView/useListViewState';
import styles from './ListViewLargeExample.module.css';

const LIST_LABEL = 'Frames';
const FRAME_COUNT = 10_000;
const FRAME_ID_PREFIX = 'frame-';

const FRAME_IDS = Array.from(
  { length: FRAME_COUNT },
  (_, index) => `${FRAME_ID_PREFIX}${String(index)}`,
);

function frameLabel(id: string): string {
  return `Frame ${id.slice(FRAME_ID_PREFIX.length)}`;
}

export function ListViewLargeExample() {
  const state = useListViewState();

  return (
    <ListView
      aria-label={LIST_LABEL}
      className={styles.list}
      itemIds={FRAME_IDS}
      getLabel={frameLabel}
      selectionMode="multiple"
      {...state}
    />
  );
}
