export function replaceItem<T>(items: readonly T[], index: number, item: T): readonly T[] {
  return items.map((current, currentIndex) => (currentIndex === index ? item : current));
}

export function removeItem<T>(items: readonly T[], index: number): readonly T[] {
  return items.filter((_, currentIndex) => currentIndex !== index);
}

export function moveItem<T>(items: readonly T[], from: number, to: number): readonly T[] {
  const item = items[from];

  if (item === undefined || from === to || to < 0 || to >= items.length) {
    return items;
  }

  const rest = removeItem(items, from);

  return [...rest.slice(0, to), item, ...rest.slice(to)];
}

export function resizeItems<T>(
  items: readonly T[],
  size: number,
  createItem: () => T,
): readonly T[] {
  if (size <= items.length) {
    return items.slice(0, Math.max(size, 0));
  }

  const last = items.at(-1);
  const added = Array.from({ length: size - items.length }, () => last ?? createItem());

  return [...items, ...added];
}

export function dropIndex(insertionIndex: number, from: number): number {
  return insertionIndex > from ? insertionIndex - 1 : insertionIndex;
}

export function insertionIndexAt(rowMiddles: readonly number[], clientY: number): number {
  const index = rowMiddles.findIndex((middle) => clientY < middle);

  return index === -1 ? rowMiddles.length : index;
}
