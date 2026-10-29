import { useRef } from 'react';
import type { KeyboardEvent } from 'react';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import checker from '@/ui/color/checker.module.css';
import { classNames } from '@/ui/classNames';
import { usePreviewSession } from '@/ui/slider/usePreviewSession';
import { useTrackDrag } from '@/ui/slider/useTrackDrag';
import styles from './ColorPicker.module.css';
import { stripKeyValue } from './colorKeys';

interface ColorStripProps {
  readonly value: number;
  readonly onValueChange: ValueChangeHandler<number>;
  readonly steps: number;
  readonly background: string;
  readonly checkered: boolean;
  readonly label: string;
}

const PERCENT = 100;

export function ColorStrip({
  value,
  onValueChange,
  steps,
  background,
  checkered,
  label,
}: ColorStripProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const session = usePreviewSession(value, onValueChange);
  const drag = useTrackDrag({
    areaRef: stripRef,
    disabled: false,
    onStart: () => {
      session.finish(true);
    },
    onMove: (point) => {
      session.preview(point.x, undefined);
    },
    onEnd: session.finish,
  });

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (session.cancelHeldKey(event) || event.ctrlKey || event.metaKey) {
      return;
    }

    const next = stripKeyValue(event.key, event, session.base(), steps);

    if (next !== undefined) {
      event.preventDefault();

      if (!drag.dragging) {
        session.preview(next, event.key);
      }
    }
  }

  return (
    <div
      ref={stripRef}
      role="slider"
      tabIndex={0}
      className={classNames(styles.strip, checkered && checker.checker)}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={steps}
      aria-valuenow={Math.round(value * steps)}
      data-dragging={drag.dragging ? '' : undefined}
      onPointerDown={drag.onPointerDown}
      onKeyDown={handleKeyDown}
      onKeyUp={session.releaseKey}
      onBlur={session.releaseFocus}
    >
      <span className={styles.stripFill} style={{ backgroundImage: background }} />
      <span className={styles.stripThumb} style={{ left: `${String(value * PERCENT)}%` }} />
    </div>
  );
}
