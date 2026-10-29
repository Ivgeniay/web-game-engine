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
import { useVirtualRows } from '@/ui/virtualList/useVirtualRows';
import type { VirtualRows } from '@/ui/virtualList/useVirtualRows';
import { useListInteraction } from './useListInteraction';
import type { ListInteraction, ListInteractionOptions } from './useListInteraction';

export interface ListBoxOptions extends Omit<
  ListInteractionOptions,
  'pageRowCount' | 'revealIndex'
> {
  readonly ref: Ref<HTMLDivElement> | undefined;
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
}

export interface ListBox {
  readonly interaction: ListInteraction;
  readonly virtualRows: VirtualRows;
  readonly renderedIndexes: readonly number[];
  readonly containerProps: ListBoxContainerProps;
  readonly rowsStyle: CSSProperties;
  readonly getRowProps: (index: number, id: string) => ListBoxRowProps;
}

const LIST_ROW_SELECTOR = '[data-list-row]';

function isBackground(event: MouseEvent<HTMLElement>): boolean {
  return event.target instanceof Element && event.target.closest(LIST_ROW_SELECTOR) === null;
}

function collectRenderedIndexes(
  { start, end }: VirtualRows,
  focusedIndex: number,
): readonly number[] {
  const indexes = Array.from({ length: end - start }, (_, offset) => start + offset);
  const focusedOutside = focusedIndex >= 0 && (focusedIndex < start || focusedIndex >= end);

  return focusedOutside ? [...indexes, focusedIndex] : indexes;
}

export function useListBox({ ref, handleOwnKey, ...interactionOptions }: ListBoxOptions): ListBox {
  const baseId = useId();
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const virtualRows = useVirtualRows(element, interactionOptions.itemIds.length);
  const interaction = useListInteraction({
    ...interactionOptions,
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

  return {
    interaction,
    virtualRows,
    renderedIndexes: collectRenderedIndexes(virtualRows, focusedIndex),
    containerProps: {
      ...roving,
      onKeyDown: (event) => {
        if (event.target !== event.currentTarget) {
          return;
        }
        if (handleOwnKey?.(event, interaction) !== true) {
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
      style: { transform: `translateY(${String(index * virtualRows.rowHeight)}px)` },
      onClick: (event) => {
        interaction.handleRowClick(id, event);
      },
    }),
  };
}
