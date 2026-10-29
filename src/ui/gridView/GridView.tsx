import { useState } from 'react';
import type { ComponentPropsWithRef } from 'react';
import type { ThumbnailLoader } from '@/contracts/thumbnail';
import { frameworkIcons } from '@/icons/frameworkIcons';
import type { IconSource } from '@/icons/icon';
import { classNames } from '@/ui/classNames';
import { ListRowContent } from '@/ui/listView/ListRowContent';
import listStyles from '@/ui/listView/listBox.module.css';
import type { ListSelectionMode } from '@/ui/listView/listSelection';
import type { ListBoxOwnProps } from '@/ui/listView/ListView';
import { useListBox } from '@/ui/listView/useListBox';
import type { ListSelectionProps } from '@/ui/listView/useListInteraction';
import { Thumbnail } from '@/ui/thumbnail/Thumbnail';
import { useMergedRefs } from '@/ui/useMergedRefs';
import { ROW_HEIGHT_TOKEN, useTokenPixels } from '@/ui/virtualList/useVirtualRows';
import { isListScale } from './gridScale';
import styles from './GridView.module.css';

const CELL_PADDING_TOKEN = '--size-list-cell-padding';
const SIDES = 2;

interface GridViewProps
  extends Omit<ComponentPropsWithRef<'div'>, ListBoxOwnProps>, ListSelectionProps {
  readonly itemIds: readonly string[];
  readonly getLabel: (id: string) => string;
  readonly getIcon?: ((id: string) => IconSource | undefined) | undefined;
  readonly loadThumbnail?: ThumbnailLoader | undefined;
  readonly cellSize: number;
  readonly selectionMode?: ListSelectionMode | undefined;
  readonly className?: string | undefined;
}

export function GridView({
  itemIds,
  getLabel,
  getIcon,
  loadThumbnail,
  cellSize,
  selectionMode = 'single',
  selectedIds,
  onSelectedIdsChange,
  focusedId,
  onFocusedIdChange,
  className,
  ref,
  ...nativeProps
}: GridViewProps) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const padding = useTokenPixels(element, CELL_PADDING_TOKEN);
  const labelHeight = useTokenPixels(element, ROW_HEIGHT_TOKEN);
  const list = isListScale(cellSize);
  const listBox = useListBox({
    ref: useMergedRefs(ref, setElement),
    grid: list
      ? undefined
      : {
          cellWidth: cellSize + padding * SIDES,
          rowHeight: cellSize + labelHeight + padding * SIDES,
        },
    itemIds,
    getLabel,
    selectionMode,
    selectedIds,
    onSelectedIdsChange,
    focusedId,
    onFocusedIdChange,
  });
  function iconOf(id: string): IconSource {
    return getIcon?.(id) ?? frameworkIcons.file;
  }

  function renderItemAt(index: number) {
    const id = itemIds[index];

    if (id === undefined) {
      return null;
    }

    const label = getLabel(id);
    const common = {
      ...listBox.getRowProps(index, id),
      role: 'option',
      'aria-setsize': itemIds.length,
      'aria-posinset': index + 1,
    };

    if (list) {
      return (
        <div key={id} {...common} className={listStyles.row}>
          <ListRowContent label={label} icon={iconOf(id)} />
        </div>
      );
    }

    return (
      <div key={id} {...common} className={styles.cell}>
        <Thumbnail
          className={styles.thumbnail}
          id={id}
          load={loadThumbnail}
          placeholder={iconOf(id)}
        />
        <span className={styles.label} data-list-row-label="">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div
      {...nativeProps}
      {...listBox.containerProps}
      role="listbox"
      aria-orientation={list ? 'vertical' : undefined}
      className={classNames(listStyles.root, styles.root, className)}
    >
      <div className={listStyles.rows} style={listBox.rowsStyle}>
        {listBox.renderedIndexes.map(renderItemAt)}
      </div>
    </div>
  );
}
