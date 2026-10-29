import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { useDragAndDropManager } from '@/ui/dragAndDrop/dragAndDropContext';
import type { DragData } from '@/contracts/dragData';
import type { DragPoint } from '@/ui/dragAndDrop/dragData';
import { useDragSource } from '@/ui/dragAndDrop/useDragSource';
import { useDropTarget } from '@/ui/dragAndDrop/useDropTarget';
import type { DropTargetProps } from '@/ui/dragAndDrop/useDropTarget';
import { isTextEntry } from '@/ui/textEntry';
import {
  autoScrollDirection,
  collectDraggedIds,
  defaultDragLabel,
  isDropIntoItself,
  placeDrop,
} from './treeDrop';
import type { AutoScrollDirection, TreeDropPlacement, TreeDropTarget } from './treeDrop';
import type { TreeModel, TreeRow } from './treeModel';

export interface TreeDragProps {
  readonly dragType?: string | undefined;
  readonly dropTypes?: readonly string[] | undefined;
  readonly canDropData?: ((data: DragData, target: TreeDropTarget) => boolean) | undefined;
  readonly onDropData?: ((data: DragData, target: TreeDropTarget) => void) | undefined;
  readonly getDragLabel?: ((ids: readonly string[]) => string) | undefined;
}

export interface TreeDragOptions extends TreeDragProps {
  readonly model: TreeModel;
  readonly rows: readonly TreeRow[];
  readonly selectedIds: readonly string[];
  readonly containerRef: RefObject<HTMLDivElement | null>;
  readonly rowHeight: number;
  readonly selectRow: (index: number) => void;
  readonly expandRow: (id: string) => void;
}

export interface TreeDragAndDrop {
  readonly placement: TreeDropPlacement | null;
  readonly dropTargetProps: DropTargetProps;
  readonly startRowDrag: (event: ReactPointerEvent<HTMLElement>, index: number) => void;
}

export const AUTO_EXPAND_DELAY_MS = 700;
export const TREE_TOGGLE_SELECTOR = '[data-tree-toggle]';

const AUTOSCROLL_ROWS_PER_FRAME = 0.5;
const NO_TYPES: readonly string[] = [];

interface PendingExpand {
  readonly id: string;
  readonly timer: number;
}

function samePlacement(first: TreeDropPlacement | null, second: TreeDropPlacement | null) {
  if (first === null || second === null) {
    return first === second;
  }

  const firstPosition = first.target.kind === 'node' ? first.target.position : first.target.kind;
  const secondPosition =
    second.target.kind === 'node' ? second.target.position : second.target.kind;

  return first.rowIndex === second.rowIndex && firstPosition === secondPosition;
}

function startsOnControl(event: ReactPointerEvent<HTMLElement>): boolean {
  const { target } = event;

  return (
    target instanceof Element &&
    (target.closest(TREE_TOGGLE_SELECTOR) !== null ||
      (target instanceof HTMLElement && isTextEntry(target)))
  );
}

export function useTreeDragAndDrop({
  dragType,
  dropTypes,
  canDropData,
  onDropData,
  getDragLabel,
  model,
  rows,
  selectedIds,
  containerRef,
  rowHeight,
  selectRow,
  expandRow,
}: TreeDragOptions): TreeDragAndDrop {
  const dropEnabled = onDropData !== undefined;
  const manager = useDragAndDropManager(dropEnabled);
  const source = useDragSource({ enabled: dragType !== undefined });
  const [placement, setPlacement] = useState<TreeDropPlacement | null>(null);
  const placementRef = useRef<TreeDropPlacement | null>(null);
  const scrollDirection = useRef<AutoScrollDirection>(0);
  const scrollFrame = useRef<number | null>(null);
  const pendingExpand = useRef<PendingExpand | null>(null);

  function showPlacement(next: TreeDropPlacement | null): void {
    if (!samePlacement(placementRef.current, next)) {
      setPlacement(next);
    }

    placementRef.current = next;
  }

  function stopAutoExpand(): void {
    if (pendingExpand.current !== null) {
      window.clearTimeout(pendingExpand.current.timer);
      pendingExpand.current = null;
    }
  }

  function updateAutoExpand(next: TreeDropPlacement | null): void {
    const row =
      next?.target.kind === 'node' && next.target.position === 'inside'
        ? rows[next.rowIndex]
        : undefined;
    const candidate = row !== undefined && row.hasChildren && !row.expanded ? row.id : null;

    if (pendingExpand.current?.id === candidate) {
      return;
    }

    stopAutoExpand();

    if (candidate !== null) {
      pendingExpand.current = {
        id: candidate,
        timer: window.setTimeout(() => {
          pendingExpand.current = null;
          expandRow(candidate);
        }, AUTO_EXPAND_DELAY_MS),
      };
    }
  }

  function stopAutoScroll(): void {
    scrollDirection.current = 0;

    if (scrollFrame.current !== null) {
      window.cancelAnimationFrame(scrollFrame.current);
      scrollFrame.current = null;
    }
  }

  function updateAutoScroll(direction: AutoScrollDirection): void {
    scrollDirection.current = direction;

    if (direction === 0 || scrollFrame.current !== null) {
      return;
    }

    const step = rowHeight * AUTOSCROLL_ROWS_PER_FRAME;

    function scrollFrameStep(): void {
      const element = containerRef.current;

      if (scrollDirection.current === 0 || element === null) {
        scrollFrame.current = null;

        return;
      }

      element.scrollTo({ top: element.scrollTop + scrollDirection.current * step });
      manager?.refresh();
      scrollFrame.current = window.requestAnimationFrame(scrollFrameStep);
    }

    scrollFrame.current = window.requestAnimationFrame(scrollFrameStep);
  }

  function stopFeedback(): void {
    showPlacement(null);
    stopAutoExpand();
    stopAutoScroll();
  }

  useEffect(
    () => () => {
      stopAutoExpand();
      stopAutoScroll();
    },
    [],
  );

  function handleDragOver(data: DragData, point: DragPoint): boolean {
    const element = containerRef.current;

    if (element === null) {
      return false;
    }

    const rect = element.getBoundingClientRect();
    const next = placeDrop(rows, point.clientY - rect.top + element.scrollTop, rowHeight);
    const intoItself = data.type === dragType && isDropIntoItself(model, data.ids, next.target);
    const allowed = !intoItself && (canDropData?.(data, next.target) ?? true);

    showPlacement(allowed ? next : null);
    updateAutoExpand(allowed ? next : null);
    updateAutoScroll(autoScrollDirection(point.clientY, rect.top, rect.bottom, rowHeight));

    return allowed;
  }

  const target = useDropTarget({
    enabled: dropEnabled,
    accepts: dropTypes ?? (dragType === undefined ? NO_TYPES : [dragType]),
    onDragOver: handleDragOver,
    onDragLeave: stopFeedback,
    onDrop: (data) => {
      const last = placementRef.current;

      stopFeedback();

      if (last !== null) {
        onDropData?.(data, last.target);
      }
    },
  });

  function startRowDrag(event: ReactPointerEvent<HTMLElement>, index: number): void {
    if (dragType === undefined || startsOnControl(event)) {
      return;
    }

    source.startDrag(event, () => {
      const row = rows[index];

      if (row === undefined) {
        return null;
      }

      const selected = selectedIds.includes(row.id);
      const ids = selected ? collectDraggedIds(model, selectedIds) : [row.id];

      if (!selected) {
        selectRow(index);
      }

      return {
        type: dragType,
        ids,
        label: getDragLabel?.(ids) ?? defaultDragLabel(model, ids),
      };
    });
  }

  return { placement, dropTargetProps: target.dropTargetProps, startRowDrag };
}
