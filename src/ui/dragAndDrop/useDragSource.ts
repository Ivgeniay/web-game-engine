import { useEffect, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useDragAndDropManager } from './dragAndDropContext';
import type { DragData } from '@/contracts/dragData';
import type { DragPoint } from './dragData';

export interface DragSourceOptions {
  readonly enabled?: boolean | undefined;
}

export interface DragSource {
  readonly startDrag: (
    event: ReactPointerEvent<HTMLElement>,
    getData: () => DragData | null,
  ) => void;
}

export const DRAG_START_THRESHOLD = 3;

const PRIMARY_BUTTON = 0;
const ESCAPE_KEY = 'Escape';
const NEXT_TASK_DELAY_MS = 0;

function pointOf(event: PointerEvent): DragPoint {
  return { clientX: event.clientX, clientY: event.clientY };
}

function suppressNextClick(): void {
  function swallow(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    remove();
  }

  function remove(): void {
    window.removeEventListener('click', swallow, true);
  }

  window.addEventListener('click', swallow, true);
  window.setTimeout(remove, NEXT_TASK_DELAY_MS);
}

export function useDragSource({ enabled = true }: DragSourceOptions = {}): DragSource {
  const manager = useDragAndDropManager(enabled);
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(
    () => () => {
      stopRef.current?.();
    },
    [],
  );

  function startDrag(event: ReactPointerEvent<HTMLElement>, getData: () => DragData | null) {
    if (!enabled || manager === null || event.button !== PRIMARY_BUTTON) {
      return;
    }

    stopRef.current?.();

    const originX = event.clientX;
    const originY = event.clientY;
    let started = false;
    let cancelled = false;

    function handleMove(moveEvent: PointerEvent): void {
      if (cancelled || manager === null) {
        return;
      }
      if (started) {
        manager.move(pointOf(moveEvent));

        return;
      }
      if (
        Math.hypot(moveEvent.clientX - originX, moveEvent.clientY - originY) < DRAG_START_THRESHOLD
      ) {
        return;
      }

      const data = getData();

      if (data === null) {
        stop();

        return;
      }

      started = true;
      window.addEventListener('keydown', handleKeyDown, true);
      manager.start(data, pointOf(moveEvent));
    }

    function handleUp(upEvent: PointerEvent): void {
      if (started && !cancelled && manager !== null) {
        manager.move(pointOf(upEvent));
        manager.drop();
      }
      if (started) {
        suppressNextClick();
      }

      stop();
    }

    function handleCancel(): void {
      if (started && !cancelled) {
        manager?.cancel();
      }

      stop();
    }

    function handleKeyDown(keyEvent: KeyboardEvent): void {
      if (keyEvent.key !== ESCAPE_KEY) {
        return;
      }

      keyEvent.preventDefault();
      keyEvent.stopPropagation();
      cancelled = true;
      manager?.cancel();
      window.removeEventListener('keydown', handleKeyDown, true);
    }

    function stop(): void {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleCancel);
      window.removeEventListener('keydown', handleKeyDown, true);
      stopRef.current = null;
    }

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleCancel);
    stopRef.current = handleCancel;
  }

  return { startDrag };
}
