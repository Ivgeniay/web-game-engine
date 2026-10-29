import { useId, useState } from 'react';
import type { ComponentPropsWithRef, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import type { IconSource } from '@/icons/icon';
import { classNames } from '@/ui/classNames';
import { useRovingFocusItem } from '@/ui/rovingFocus/useRovingFocusItem';
import { useMergedRefs } from '@/ui/useMergedRefs';
import { useVirtualRows } from '@/ui/virtualList/useVirtualRows';
import { ListRowContent } from './ListRowContent';
import type { ListSelectionMode } from './listSelection';
import { useListInteraction } from './useListInteraction';
import type { ListSelectionProps } from './useListInteraction';
import styles from './ListView.module.css';

export interface ListRowState {
  readonly id: string;
  readonly index: number;
  readonly label: string;
  readonly selected: boolean;
  readonly focused: boolean;
}

type OwnDivProps =
  | 'children'
  | 'style'
  | 'role'
  | 'tabIndex'
  | 'onKeyDown'
  | 'onClick'
  | 'onFocus'
  | 'aria-activedescendant'
  | 'aria-multiselectable';

interface ListViewProps
  extends Omit<ComponentPropsWithRef<'div'>, OwnDivProps>, ListSelectionProps {
  readonly itemIds: readonly string[];
  readonly getLabel: (id: string) => string;
  readonly getIcon?: ((id: string) => IconSource | undefined) | undefined;
  readonly renderRow?: ((row: ListRowState) => ReactNode) | undefined;
  readonly selectionMode?: ListSelectionMode | undefined;
  readonly className?: string | undefined;
}

const LIST_ROW_SELECTOR = '[data-list-row]';

function isBackground(event: MouseEvent<HTMLElement>): boolean {
  return event.target instanceof Element && event.target.closest(LIST_ROW_SELECTOR) === null;
}

function renderedIndexes(start: number, end: number, focusedIndex: number): readonly number[] {
  const indexes = Array.from({ length: end - start }, (_, offset) => start + offset);
  const focusedOutside = focusedIndex >= 0 && (focusedIndex < start || focusedIndex >= end);

  return focusedOutside ? [...indexes, focusedIndex] : indexes;
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
  const baseId = useId();
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const virtualRows = useVirtualRows(element, itemIds.length);
  const interaction = useListInteraction({
    itemIds,
    getLabel,
    selectionMode,
    selectedIds,
    onSelectedIdsChange,
    focusedId,
    onFocusedIdChange,
    pageRowCount: virtualRows.pageRowCount,
    revealIndex: virtualRows.revealIndex,
  });
  const roving = useRovingFocusItem<HTMLDivElement>({
    ref: useMergedRefs(ref, setElement),
    tabIndex: 0,
    onFocus: (event) => {
      if (event.target === event.currentTarget) {
        interaction.handleFocus();
      }
    },
    disabled: false,
    preferred: false,
  });

  const { focusedIndex, selectedSet } = interaction;

  function rowId(index: number): string {
    return `${baseId}-row-${String(index)}`;
  }

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
        id={rowId(index)}
        role="option"
        aria-selected={row.selected}
        aria-setsize={itemIds.length}
        aria-posinset={index + 1}
        className={styles.row}
        data-focused={row.focused || undefined}
        data-list-row=""
        style={{ transform: `translateY(${String(index * virtualRows.rowHeight)}px)` }}
        onClick={(event) => {
          interaction.handleRowClick(id, event);
        }}
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
      {...roving}
      role="listbox"
      aria-multiselectable={selectionMode === 'multiple' || undefined}
      aria-activedescendant={focusedIndex >= 0 ? rowId(focusedIndex) : undefined}
      className={classNames(styles.root, className)}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        interaction.handleKeyDown(event);
      }}
      onClick={(event) => {
        if (isBackground(event)) {
          interaction.handleBackgroundClick();
        }
      }}
    >
      <div className={styles.rows} style={{ height: virtualRows.totalHeight }}>
        {renderedIndexes(virtualRows.start, virtualRows.end, focusedIndex).map(renderRowAt)}
      </div>
    </div>
  );
}
