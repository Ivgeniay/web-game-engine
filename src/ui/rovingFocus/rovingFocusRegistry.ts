export interface RovingFocusItem<E> {
  readonly element: E;
  readonly disabled: boolean;
  readonly preferred: boolean;
}

export interface RovingFocusEntry<E> {
  readonly id: string;
  readonly item: RovingFocusItem<E>;
}

export interface RovingFocusRegistry<E> {
  readonly setItem: (id: string, item: RovingFocusItem<E>) => void;
  readonly removeItem: (id: string) => void;
  readonly setActive: (id: string) => void;
  readonly getTabStopId: () => string | undefined;
  readonly getOrderedEntries: () => readonly RovingFocusEntry<E>[];
  readonly subscribe: (listener: () => void) => () => void;
}

export type CompareElementOrder<E> = (first: E, second: E) => number;

export function createRovingFocusRegistry<E>(
  compareOrder: CompareElementOrder<E>,
): RovingFocusRegistry<E> {
  const items = new Map<string, RovingFocusItem<E>>();
  const listeners = new Set<() => void>();
  let activeId: string | undefined;
  let tabStopId: string | undefined;

  function getOrderedEntries(): readonly RovingFocusEntry<E>[] {
    return [...items]
      .map(([id, item]) => ({ id, item }))
      .sort((first, second) => compareOrder(first.item.element, second.item.element));
  }

  function findTabStopId(): string | undefined {
    const enabled = getOrderedEntries().filter((entry) => !entry.item.disabled);
    const active = enabled.find((entry) => entry.id === activeId);
    const preferred = enabled.find((entry) => entry.item.preferred);

    return (active ?? preferred ?? enabled[0])?.id;
  }

  function update(): void {
    tabStopId = findTabStopId();

    for (const listener of listeners) {
      listener();
    }
  }

  return {
    setItem(id, item) {
      items.set(id, item);
      update();
    },
    removeItem(id) {
      items.delete(id);
      update();
    },
    setActive(id) {
      activeId = id;
      update();
    },
    getTabStopId: () => tabStopId,
    getOrderedEntries,
    subscribe(listener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
}
