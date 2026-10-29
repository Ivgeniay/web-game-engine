import { useMemo, useRef } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { useLocale } from '@/ui/locale/useLocale';
import { isModPressed } from '@/ui/platform/modifierKey';
import { useIsMacPlatform } from '@/ui/platform/useIsMacPlatform';
import {
  EMPTY_TYPEAHEAD,
  continueTypeahead,
  findTypeaheadMatch,
  isListNavigationKey,
  isTypeaheadKey,
  navigationIndex,
} from './listNavigation';
import { PLAIN_GESTURE, applySelectionGesture, haveSameIds } from './listSelection';
import type { ListSelectionMode, SelectionGesture } from './listSelection';

export interface ListSelectionProps {
  readonly selectedIds: readonly string[];
  readonly onSelectedIdsChange: (selectedIds: readonly string[]) => void;
  readonly focusedId: string | null;
  readonly onFocusedIdChange: (focusedId: string | null) => void;
}

export interface ListInteractionOptions extends ListSelectionProps {
  readonly itemIds: readonly string[];
  readonly getLabel: (id: string) => string;
  readonly selectionMode: ListSelectionMode;
  readonly pageRowCount: number;
  readonly revealIndex: (index: number) => void;
}

export interface ListInteraction {
  readonly focusedIndex: number;
  readonly selectedSet: ReadonlySet<string>;
  readonly handleKeyDown: (event: KeyboardEvent<HTMLElement>) => boolean;
  readonly handleRowClick: (id: string, event: MouseEvent<HTMLElement>) => void;
  readonly handleRowContextMenu: (id: string) => void;
  readonly handleBackgroundClick: () => void;
  readonly handleFocus: () => void;
  readonly moveFocus: (index: number, gesture: SelectionGesture | null) => void;
  readonly navigateTo: (event: KeyboardEvent<HTMLElement>, index: number) => void;
}

const SELECT_ALL_LETTER = 'a';
const SELECT_ALL_CODE = 'KeyA';
const SPACE_KEY = ' ';
const LATIN_LETTER_PATTERN = /^[a-z]$/i;
const NO_INDEX = -1;

function isSelectAllKey(event: KeyboardEvent<HTMLElement>): boolean {
  if (event.shiftKey || event.altKey) {
    return false;
  }

  return LATIN_LETTER_PATTERN.test(event.key)
    ? event.key.toLowerCase() === SELECT_ALL_LETTER
    : event.code === SELECT_ALL_CODE;
}

export function useListInteraction({
  itemIds,
  getLabel,
  selectionMode,
  selectedIds,
  onSelectedIdsChange,
  focusedId,
  onFocusedIdChange,
  pageRowCount,
  revealIndex,
}: ListInteractionOptions): ListInteraction {
  const locale = useLocale();
  const isMac = useIsMacPlatform();
  const anchorId = useRef<string | null>(null);
  const emittedSelection = useRef<readonly string[] | null>(null);
  const typeahead = useRef(EMPTY_TYPEAHEAD);

  const indexById = useMemo(() => new Map(itemIds.map((id, index) => [id, index])), [itemIds]);
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const focusedIndex = focusedId === null ? NO_INDEX : (indexById.get(focusedId) ?? NO_INDEX);
  const multiple = selectionMode === 'multiple';

  function currentAnchor(): string | null {
    return emittedSelection.current === selectedIds ? anchorId.current : focusedId;
  }

  function emitSelection(next: readonly string[]): void {
    if (haveSameIds(next, selectedIds)) {
      emittedSelection.current = selectedIds;

      return;
    }

    emittedSelection.current = next;
    onSelectedIdsChange(next);
  }

  function select(id: string, gesture: SelectionGesture): void {
    const next = applySelectionGesture(
      itemIds,
      { selectedIds, anchorId: currentAnchor() },
      id,
      gesture,
      selectionMode,
    );

    anchorId.current = next.anchorId;
    emitSelection(next.selectedIds);
  }

  function focus(id: string): void {
    if (id !== focusedId) {
      onFocusedIdChange(id);
    }
  }

  function moveFocus(index: number, gesture: SelectionGesture | null): void {
    const id = itemIds[index];

    if (id === undefined) {
      return;
    }

    focus(id);

    if (gesture !== null) {
      select(id, gesture);
    }

    revealIndex(index);
  }

  function gestureOf(event: KeyboardEvent<HTMLElement> | MouseEvent<HTMLElement>) {
    return { toggle: isModPressed(event, isMac), extend: event.shiftKey };
  }

  function handleNavigationKey(event: KeyboardEvent<HTMLElement>, index: number): void {
    const mod = isModPressed(event, isMac);

    if (multiple && mod && !event.shiftKey) {
      moveFocus(index, null);
    } else {
      moveFocus(index, { toggle: false, extend: event.shiftKey });
    }
  }

  function handleTypeahead(event: KeyboardEvent<HTMLElement>): void {
    typeahead.current = continueTypeahead(typeahead.current, event.key, event.timeStamp);

    const index = findTypeaheadMatch(
      itemIds,
      getLabel,
      focusedIndex,
      typeahead.current.query,
      locale,
    );

    if (index !== NO_INDEX) {
      moveFocus(index, PLAIN_GESTURE);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>): boolean {
    if (event.target !== event.currentTarget) {
      return false;
    }

    const mod = isModPressed(event, isMac);
    const hasCommandModifier = event.ctrlKey || event.metaKey || event.altKey;

    if (isListNavigationKey(event.key) && !event.altKey) {
      event.preventDefault();
      handleNavigationKey(
        event,
        navigationIndex(event.key, focusedIndex, itemIds.length, pageRowCount),
      );

      return true;
    }

    if (multiple && mod && isSelectAllKey(event)) {
      event.preventDefault();
      anchorId.current = null;
      emitSelection(itemIds);

      return true;
    }

    if (isTypeaheadKey(event.key, typeahead.current, event.timeStamp, hasCommandModifier)) {
      event.preventDefault();
      handleTypeahead(event);

      return true;
    }

    if (event.key === SPACE_KEY && focusedId !== null && focusedIndex !== NO_INDEX) {
      event.preventDefault();
      select(focusedId, gestureOf(event));

      return true;
    }

    return false;
  }

  function handleRowClick(id: string, event: MouseEvent<HTMLElement>): void {
    focus(id);
    select(id, gestureOf(event));
  }

  function handleRowContextMenu(id: string): void {
    focus(id);

    if (!selectedSet.has(id)) {
      select(id, PLAIN_GESTURE);
    }
  }

  function handleBackgroundClick(): void {
    anchorId.current = null;
    emitSelection([]);
  }

  function handleFocus(): void {
    if (focusedIndex !== NO_INDEX) {
      return;
    }

    const firstSelected = selectedIds.find((id) => indexById.has(id));
    const id = firstSelected ?? itemIds[0];

    if (id !== undefined) {
      onFocusedIdChange(id);
      revealIndex(indexById.get(id) ?? 0);
    }
  }

  return {
    focusedIndex,
    selectedSet,
    handleKeyDown,
    handleRowClick,
    handleRowContextMenu,
    handleBackgroundClick,
    handleFocus,
    moveFocus,
    navigateTo: handleNavigationKey,
  };
}
