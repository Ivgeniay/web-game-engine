import { useId, useState } from 'react';
import type {
  CSSProperties,
  FocusEventHandler,
  KeyboardEvent,
  MouseEvent,
  MouseEventHandler,
  KeyboardEventHandler,
  Ref,
  RefCallback,
} from 'react';
import { useRovingFocusItem } from '@/ui/rovingFocus/useRovingFocusItem';
import { useMergedRefs } from '@/ui/useMergedRefs';
import { useElementWidth, useVirtualRows } from '@/ui/virtualList/useVirtualRows';
import type { VirtualRows } from '@/ui/virtualList/useVirtualRows';
import type { VirtualRange } from '@/ui/virtualList/virtualRange';
import { gridNavigationIndex, isGridNavigationKey } from './listNavigation';
import { useListInteraction } from './useListInteraction';
import type { ListInteraction, ListInteractionOptions } from './useListInteraction';

export interface ListBoxGrid {
  readonly cellWidth: number;
  readonly rowHeight: number;
}

export interface ListBoxOptions extends Omit<
  ListInteractionOptions,
  'pageRowCount' | 'revealIndex'
> {
  readonly ref: Ref<HTMLDivElement> | undefined;
  readonly grid?: ListBoxGrid | undefined;
  readonly handleOwnKey?:
    ((event: KeyboardEvent<HTMLElement>, interaction: ListInteraction) => boolean) | undefined;
}

export interface ListBoxContainerProps {
  readonly ref: RefCallback<HTMLDivElement>;
  readonly tabIndex: number | undefined;
  readonly onFocus: FocusEventHandler<HTMLDivElement>;
  readonly onKeyDown: KeyboardEventHandler<HTMLDivElement>;
  readonly onClick: MouseEventHandler<HTMLDivElement>;
  readonly 'aria-multiselectable': true | undefined;
  readonly 'aria-activedescendant': string | undefined;
}

export interface ListBoxRowProps {
  readonly id: string;
  readonly 'aria-selected': boolean;
  readonly 'data-focused': true | undefined;
  readonly 'data-list-row': '';
  readonly style: CSSProperties;
  readonly onClick: MouseEventHandler<HTMLDivElement>;
  readonly onContextMenu: MouseEventHandler<HTMLDivElement>;
}

export interface ListBox {
  readonly interaction: ListInteraction;
  readonly virtualRows: VirtualRows;
  readonly columns: number;
  readonly renderedIndexes: readonly number[];
  readonly containerProps: ListBoxContainerProps;
  readonly rowsStyle: CSSProperties;
  readonly getRowProps: (index: number, id: string) => ListBoxRowProps;
}

const LIST_ROW_SELECTOR = '[data-list-row]';
const SINGLE_COLUMN = 1;

function isBackground(event: MouseEvent<HTMLElement>): boolean {
  return event.target instanceof Element && event.target.closest(LIST_ROW_SELECTOR) === null;
}

function countColumns(width: number, grid: ListBoxGrid | undefined): number {
  if (grid === undefined || grid.cellWidth <= 0) {
    return SINGLE_COLUMN;
  }

  return Math.max(SINGLE_COLUMN, Math.floor(width / grid.cellWidth));
}

function collectRenderedIndexes(
  { start, end }: VirtualRange,
  focusedIndex: number,
): readonly number[] {
  const indexes = Array.from({ length: end - start }, (_, offset) => start + offset);
  const focusedOutside = focusedIndex >= 0 && (focusedIndex < start || focusedIndex >= end);

  return focusedOutside ? [...indexes, focusedIndex] : indexes;
}

export function useListBox({
  ref,
  grid,
  handleOwnKey,
  ...interactionOptions
}: ListBoxOptions): ListBox {
  const baseId = useId();
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const width = useElementWidth(element);
  const columns = countColumns(width, grid);
  const itemCount = interactionOptions.itemIds.length;
  const virtualRows = useVirtualRows(element, Math.ceil(itemCount / columns), grid?.rowHeight);
  const interaction = useListInteraction({
    ...interactionOptions,
    pageRowCount: virtualRows.pageRowCount * columns,
    revealIndex: (index) => {
      virtualRows.revealIndex(Math.floor(index / columns));
    },
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

  function handleGridKey(event: KeyboardEvent<HTMLElement>): boolean {
    if (grid === undefined || event.altKey || !isGridNavigationKey(event.key)) {
      return false;
    }

    event.preventDefault();
    interaction.navigateTo(event, gridNavigationIndex(event.key, focusedIndex, itemCount, columns));

    return true;
  }

  function rowStyle(index: number): CSSProperties {
    if (grid === undefined) {
      return { transform: `translateY(${String(index * virtualRows.rowHeight)}px)` };
    }

    const column = index % columns;
    const row = Math.floor(index / columns);

    return {
      width: grid.cellWidth,
      height: grid.rowHeight,
      transform: `translate(${String(column * grid.cellWidth)}px, ${String(row * grid.rowHeight)}px)`,
    };
  }

  return {
    interaction,
    virtualRows,
    columns,
    renderedIndexes: collectRenderedIndexes(
      {
        start: virtualRows.start * columns,
        end: Math.min(virtualRows.end * columns, itemCount),
      },
      focusedIndex,
    ),
    containerProps: {
      ...roving,
      onKeyDown: (event) => {
        if (event.target !== event.currentTarget) {
          return;
        }
        if (handleOwnKey?.(event, interaction) !== true && !handleGridKey(event)) {
          interaction.handleKeyDown(event);
        }
      },
      onClick: (event) => {
        if (isBackground(event)) {
          interaction.handleBackgroundClick();
        }
      },
      'aria-multiselectable': interactionOptions.selectionMode === 'multiple' || undefined,
      'aria-activedescendant': focusedIndex >= 0 ? rowId(focusedIndex) : undefined,
    },
    rowsStyle: { height: virtualRows.totalHeight },
    getRowProps: (index, id) => ({
      id: rowId(index),
      'aria-selected': selectedSet.has(id),
      'data-focused': index === focusedIndex || undefined,
      'data-list-row': '',
      style: rowStyle(index),
      onClick: (event) => {
        interaction.handleRowClick(id, event);
      },
      onContextMenu: () => {
        interaction.handleRowContextMenu(id);
      },
    }),
  };
}
