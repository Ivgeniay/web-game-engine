export const LIST_SELECTION_MODES = ['single', 'multiple'] as const;

export type ListSelectionMode = (typeof LIST_SELECTION_MODES)[number];

export interface SelectionGesture {
  readonly toggle: boolean;
  readonly extend: boolean;
}

export interface ListSelection {
  readonly selectedIds: readonly string[];
  readonly anchorId: string | null;
}

export const PLAIN_GESTURE: SelectionGesture = { toggle: false, extend: false };

export function orderSelection(
  itemIds: readonly string[],
  selectedIds: Iterable<string>,
): readonly string[] {
  const selected = new Set(selectedIds);
  const visible = itemIds.filter((id) => selected.has(id));
  const visibleSet = new Set(visible);
  const hidden = [...selected].filter((id) => !visibleSet.has(id));

  return [...visible, ...hidden];
}

function selectRange(itemIds: readonly string[], fromId: string, toId: string): readonly string[] {
  const from = itemIds.indexOf(fromId);
  const to = itemIds.indexOf(toId);

  return itemIds.slice(Math.min(from, to), Math.max(from, to) + 1);
}

function toggleId(selectedIds: readonly string[], id: string): readonly string[] {
  return selectedIds.includes(id)
    ? selectedIds.filter((selectedId) => selectedId !== id)
    : [...selectedIds, id];
}

export function applySelectionGesture(
  itemIds: readonly string[],
  selection: ListSelection,
  targetId: string,
  gesture: SelectionGesture,
  mode: ListSelectionMode,
): ListSelection {
  if (mode === 'single' || (!gesture.toggle && !gesture.extend)) {
    return { selectedIds: [targetId], anchorId: targetId };
  }

  if (gesture.extend) {
    const { anchorId } = selection;
    const rangeStart = anchorId !== null && itemIds.includes(anchorId) ? anchorId : targetId;
    const range = selectRange(itemIds, rangeStart, targetId);
    const selectedIds = gesture.toggle ? [...selection.selectedIds, ...range] : range;

    return { selectedIds: orderSelection(itemIds, selectedIds), anchorId: rangeStart };
  }

  return {
    selectedIds: orderSelection(itemIds, toggleId(selection.selectedIds, targetId)),
    anchorId: targetId,
  };
}

export function haveSameIds(first: readonly string[], second: readonly string[]): boolean {
  return first.length === second.length && first.every((id, index) => second[index] === id);
}
