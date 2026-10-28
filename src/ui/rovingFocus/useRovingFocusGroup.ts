import { useCallback, useContext, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { findRovingTarget, rovingMoveForKey } from './rovingFocus';
import type { RovingOrientation } from './rovingFocus';
import { RovingFocusContext } from './rovingFocusContext';
import { createRovingFocusRegistry } from './rovingFocusRegistry';
import type { RovingFocusRegistry } from './rovingFocusRegistry';

export interface RovingFocusGroupOptions {
  readonly orientation: RovingOrientation;
  readonly loop?: boolean;
  readonly joinParentGroup?: boolean;
  readonly onNavigate?: (element: HTMLElement) => void;
}

export interface RovingFocusGroup {
  readonly registry: RovingFocusRegistry<HTMLElement>;
  readonly onKeyDown: ((event: KeyboardEvent<HTMLElement>) => void) | undefined;
}

interface RovingFocusItems {
  readonly elements: readonly HTMLElement[];
  readonly enabled: readonly boolean[];
  readonly current: number;
}

const NO_ITEM = -1;

const NON_TEXT_INPUT_TYPES: ReadonlySet<string> = new Set([
  'button',
  'checkbox',
  'color',
  'file',
  'image',
  'radio',
  'range',
  'reset',
  'submit',
]);

function compareDocumentOrder(first: HTMLElement, second: HTMLElement): number {
  if (first === second) {
    return 0;
  }

  const secondFollows =
    (first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;

  return secondFollows ? -1 : 1;
}

function isTextEntry(target: EventTarget): boolean {
  if (target instanceof HTMLInputElement) {
    return !NON_TEXT_INPUT_TYPES.has(target.type);
  }

  return (
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

function isInsideGroup(event: KeyboardEvent<HTMLElement>): boolean {
  return event.target instanceof Node && event.currentTarget.contains(event.target);
}

function readItems(
  registry: RovingFocusRegistry<HTMLElement>,
  target: EventTarget,
): RovingFocusItems {
  const entries = registry.getOrderedEntries();
  const elements = entries.map((entry) => entry.item.element);
  const current =
    target instanceof Node ? elements.findIndex((element) => element.contains(target)) : NO_ITEM;

  return { elements, enabled: entries.map((entry) => !entry.item.disabled), current };
}

export function useRovingFocusGroup({
  orientation,
  loop = true,
  joinParentGroup = false,
  onNavigate,
}: RovingFocusGroupOptions): RovingFocusGroup {
  const parentRegistry = useContext(RovingFocusContext);
  const [ownRegistry] = useState(() => createRovingFocusRegistry(compareDocumentOrder));
  const joinsParent = joinParentGroup && parentRegistry !== null;
  const registry = joinsParent ? parentRegistry : ownRegistry;

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      const move = rovingMoveForKey(event.key, orientation);

      if (
        move === undefined ||
        event.defaultPrevented ||
        !isInsideGroup(event) ||
        isTextEntry(event.target)
      ) {
        return;
      }

      const { elements, enabled, current } = readItems(ownRegistry, event.target);
      const target = findRovingTarget(enabled, current, move, loop);
      const element = target === undefined ? undefined : elements[target];

      event.preventDefault();

      if (element !== undefined) {
        element.focus();
        onNavigate?.(element);
      }
    },
    [ownRegistry, orientation, loop, onNavigate],
  );

  return { registry, onKeyDown: joinsParent ? undefined : onKeyDown };
}
