import { useEffect, useRef, useState } from 'react';
import type { MouseEvent, PointerEvent as ReactPointerEvent } from 'react';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { DEFAULT_STEP } from '@/ui/numberField/numberStep';
import type { NumberKind } from '@/ui/numberField/numberText';
import { isTextEntry } from '@/ui/textEntry';
import styles from './valueDrag.module.css';
import { moveValueDrag, startValueDrag } from './valueDragSession';
import type { ValueDragState } from './valueDragSession';

export interface ValueDragTarget {
  readonly value: number;
  readonly onValueChange: ValueChangeHandler<number>;
  readonly kind?: NumberKind | undefined;
  readonly min?: number | undefined;
  readonly max?: number | undefined;
  readonly step?: number | undefined;
  readonly infinite?: boolean | undefined;
}

export interface ValueDragZoneProps {
  readonly className: string | undefined;
  readonly onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  readonly onClick: (event: MouseEvent<HTMLElement>) => void;
}

export interface ValueDrag {
  readonly dragging: boolean;
  readonly zoneProps: ValueDragZoneProps;
}

const PRIMARY_BUTTON = 0;
const ESCAPE_KEY = 'Escape';
const DRAGGING_ATTRIBUTE = 'data-value-dragging';

function blurTextEntry(): void {
  const active = document.activeElement;

  if (active instanceof HTMLElement && isTextEntry(active)) {
    active.blur();
  }
}

export function useValueDrag(target: ValueDragTarget | undefined, disabled = false): ValueDrag {
  const [dragging, setDragging] = useState(false);
  const targetRef = useRef(target);
  const stopRef = useRef<((commit: boolean) => void) | null>(null);
  const suppressClickRef = useRef(false);
  const enabled = target !== undefined && !disabled;

  useEffect(() => {
    targetRef.current = target;
  });

  useEffect(
    () => () => {
      stopRef.current?.(false);
    },
    [],
  );

  function startDrag(event: ReactPointerEvent<HTMLElement>): void {
    const current = targetRef.current;

    if (!enabled || current === undefined || event.button !== PRIMARY_BUTTON) {
      return;
    }

    event.preventDefault();
    stopRef.current?.(false);
    blurTextEntry();

    const element = event.currentTarget;
    const pointerId = event.pointerId;
    let state: ValueDragState = startValueDrag(current.value);
    let lastX = event.clientX;
    let locked = false;
    let finished = false;

    function emit(value: number, phase: 'preview' | 'commit' | 'cancel'): void {
      targetRef.current?.onValueChange(value, phase);
    }

    function handleMove(moveEvent: PointerEvent): void {
      const movement = locked ? moveEvent.movementX : moveEvent.clientX - lastX;
      lastX = moveEvent.clientX;
      const options = targetRef.current;

      if (options === undefined) {
        return;
      }

      const kind = options.kind ?? 'float';
      const wasStarted = state.started;
      const move = moveValueDrag(state, movement, moveEvent, {
        step: options.step ?? DEFAULT_STEP[kind],
        limits: { kind, min: options.min, max: options.max },
      });
      state = move.state;

      if (!wasStarted && state.started) {
        state = { ...state, startValue: options.value, value: options.value };
        suppressClickRef.current = true;
        setDragging(true);
        document.documentElement.setAttribute(DRAGGING_ATTRIBUTE, '');

        if (options.infinite === true) {
          lockPointer();
        }
      }

      if (move.preview !== undefined) {
        emit(state.value, 'preview');
      }
    }

    function lockPointer(): void {
      Promise.resolve(element.requestPointerLock()).catch(() => undefined);
    }

    function handlePointerLockChange(): void {
      if (document.pointerLockElement === element) {
        locked = true;
      } else if (locked && !finished) {
        locked = false;
        stop(false);
      }
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
      document.removeEventListener('pointerlockchange', handlePointerLockChange);

      if (element.hasPointerCapture(pointerId)) {
        element.releasePointerCapture(pointerId);
      }

      if (document.pointerLockElement === element) {
        document.exitPointerLock();
      }

      if (state.started) {
        document.documentElement.removeAttribute(DRAGGING_ATTRIBUTE);
        setDragging(false);

        if (commit) {
          emit(state.value, 'commit');
        } else {
          emit(state.startValue, 'cancel');
        }
      }
    }

    element.setPointerCapture(pointerId);
    element.addEventListener('pointermove', handleMove);
    element.addEventListener('pointerup', handleUp);
    element.addEventListener('pointercancel', handleCancel);
    window.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    stopRef.current = stop;
  }

  return {
    dragging,
    zoneProps: {
      className: enabled ? styles.zone : undefined,
      onPointerDown: startDrag,
      onClick: (event) => {
        if (suppressClickRef.current) {
          suppressClickRef.current = false;
          event.preventDefault();
        }
      },
    },
  };
}
