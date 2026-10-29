import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';

export interface TrackPoint {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface TrackDragHandlers {
  readonly onStart: () => void;
  readonly onMove: (point: TrackPoint) => void;
  readonly onEnd: (commit: boolean) => void;
}

export interface TrackDragOptions extends TrackDragHandlers {
  readonly areaRef: RefObject<HTMLElement | null>;
  readonly disabled: boolean;
}

export interface TrackDrag {
  readonly dragging: boolean;
  readonly onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
}

const PRIMARY_BUTTON = 0;
const ESCAPE_KEY = 'Escape';

function clampFraction(fraction: number): number {
  return Math.min(Math.max(fraction, 0), 1);
}

function trackPoint(area: HTMLElement, clientX: number, clientY: number): TrackPoint {
  const rect = area.getBoundingClientRect();

  return {
    x: rect.width > 0 ? clampFraction((clientX - rect.left) / rect.width) : 0,
    y: rect.height > 0 ? clampFraction((clientY - rect.top) / rect.height) : 0,
    width: rect.width,
    height: rect.height,
  };
}

export function useTrackDrag({ areaRef, disabled, ...handlers }: TrackDragOptions): TrackDrag {
  const [dragging, setDragging] = useState(false);
  const handlersRef = useRef<TrackDragHandlers>(handlers);
  const stopRef = useRef<((commit: boolean) => void) | null>(null);

  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(
    () => () => {
      stopRef.current?.(false);
    },
    [],
  );

  function onPointerDown(event: ReactPointerEvent<HTMLElement>): void {
    const area = areaRef.current;

    if (disabled || area === null || event.button !== PRIMARY_BUTTON) {
      return;
    }

    event.preventDefault();
    stopRef.current?.(false);

    const element = event.currentTarget;
    const measured: HTMLElement = area;
    const pointerId = event.pointerId;
    let finished = false;

    element.focus();

    function move(clientX: number, clientY: number): void {
      handlersRef.current.onMove(trackPoint(measured, clientX, clientY));
    }

    function handleMove(moveEvent: PointerEvent): void {
      move(moveEvent.clientX, moveEvent.clientY);
    }

    function handleKeyDown(keyEvent: KeyboardEvent): void {
      if (keyEvent.key === ESCAPE_KEY) {
        keyEvent.preventDefault();
        keyEvent.stopPropagation();
        stop(false);
      }
    }

    function handleUp(): void {
      stop(true);
    }

    function handleCancel(): void {
      stop(false);
    }

    function stop(commit: boolean): void {
      if (finished) {
        return;
      }

      finished = true;
      stopRef.current = null;
      element.removeEventListener('pointermove', handleMove);
      element.removeEventListener('pointerup', handleUp);
      element.removeEventListener('pointercancel', handleCancel);
      window.removeEventListener('keydown', handleKeyDown, true);

      if (element.hasPointerCapture(pointerId)) {
        element.releasePointerCapture(pointerId);
      }

      setDragging(false);
      handlersRef.current.onEnd(commit);
    }

    element.setPointerCapture(pointerId);
    element.addEventListener('pointermove', handleMove);
    element.addEventListener('pointerup', handleUp);
    element.addEventListener('pointercancel', handleCancel);
    window.addEventListener('keydown', handleKeyDown, true);
    stopRef.current = stop;
    setDragging(true);
    handlersRef.current.onStart();
    move(event.clientX, event.clientY);
  }

  return { dragging, onPointerDown };
}
