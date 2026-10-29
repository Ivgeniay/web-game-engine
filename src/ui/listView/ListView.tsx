import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { IconSource } from '@/icons/icon';
import { classNames } from '@/ui/classNames';
import { ListRowContent } from './ListRowContent';
import type { ListSelectionMode } from './listSelection';
import { useListBox } from './useListBox';
import type { ListBoxContainerProps } from './useListBox';
import type { ListSelectionProps } from './useListInteraction';
import styles from './listBox.module.css';

export interface ListRowState {
  readonly id: string;
  readonly index: number;
  readonly label: string;
  readonly selected: boolean;
  readonly focused: boolean;
}

export type ListBoxOwnProps =
  Exclude<keyof ListBoxContainerProps, 'ref'> | 'children' | 'style' | 'role';

interface ListViewProps
  extends Omit<ComponentPropsWithRef<'div'>, ListBoxOwnProps>, ListSelectionProps {
  readonly itemIds: readonly string[];
  readonly getLabel: (id: string) => string;
  readonly getIcon?: ((id: string) => IconSource | undefined) | undefined;
  readonly renderRow?: ((row: ListRowState) => ReactNode) | undefined;
  readonly selectionMode?: ListSelectionMode | undefined;
  readonly className?: string | undefined;
}

export function ListView({
  itemIds,
  getLabel,
  getIcon,
  renderRow,
  selectionMode = 'single',
  selectedIds,
  onSelectedIdsChange,
  focusedId,
  onFocusedIdChange,
  className,
  ref,
  ...nativeProps
}: ListViewProps) {
  const listBox = useListBox({
    ref,
    itemIds,
    getLabel,
    selectionMode,
    selectedIds,
    onSelectedIdsChange,
    focusedId,
    onFocusedIdChange,
  });
  const { focusedIndex, selectedSet } = listBox.interaction;

  function renderRowAt(index: number) {
    const id = itemIds[index];

    if (id === undefined) {
      return null;
    }

    const row: ListRowState = {
      id,
      index,
      label: getLabel(id),
      selected: selectedSet.has(id),
      focused: index === focusedIndex,
    };

    return (
      <div
        key={id}
        role="option"
        aria-setsize={itemIds.length}
        aria-posinset={index + 1}
        className={styles.row}
        {...listBox.getRowProps(index, id)}
      >
        {renderRow === undefined ? (
          <ListRowContent label={row.label} icon={getIcon?.(id)} />
        ) : (
          renderRow(row)
        )}
      </div>
    );
  }

  return (
    <div
      {...nativeProps}
      {...listBox.containerProps}
      role="listbox"
      className={classNames(styles.root, className)}
    >
      <div className={styles.rows} style={listBox.rowsStyle}>
        {listBox.renderedIndexes.map(renderRowAt)}
      </div>
    </div>
  );
}
