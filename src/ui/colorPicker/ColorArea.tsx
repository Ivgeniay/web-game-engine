import { useRef } from 'react';
import type { KeyboardEvent } from 'react';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { saturationValueGradient } from '@/ui/color/colorModel';
import { usePreviewSession } from '@/ui/slider/usePreviewSession';
import { useTrackDrag } from '@/ui/slider/useTrackDrag';
import styles from './ColorPicker.module.css';
import { areaKeyValue } from './colorKeys';
import type { SaturationBrightness } from './colorKeys';

interface ColorAreaProps {
  readonly value: SaturationBrightness;
  readonly hue: number;
  readonly onValueChange: ValueChangeHandler<SaturationBrightness>;
  readonly label: string;
  readonly roleDescription: string;
  readonly valueText: string;
}

const PERCENT = 100;

export function ColorArea({
  value,
  hue,
  onValueChange,
  label,
  roleDescription,
  valueText,
}: ColorAreaProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const session = usePreviewSession(value, onValueChange);
  const drag = useTrackDrag({
    areaRef,
    disabled: false,
    onStart: () => {
      session.finish(true);
    },
    onMove: (point) => {
      session.preview({ s: point.x, v: 1 - point.y }, undefined);
    },
    onEnd: session.finish,
  });

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (session.cancelHeldKey(event) || event.ctrlKey || event.metaKey) {
      return;
    }

    const next = areaKeyValue(event.key, event, session.base());

    if (next !== undefined) {
      event.preventDefault();

      if (!drag.dragging) {
        session.preview(next, event.key);
      }
    }
  }

  return (
    <div
      ref={areaRef}
      role="slider"
      tabIndex={0}
      className={styles.area}
      style={{ backgroundImage: saturationValueGradient(hue) }}
      aria-label={label}
      aria-roledescription={roleDescription}
      aria-valuemin={0}
      aria-valuemax={PERCENT}
      aria-valuenow={Math.round(value.s * PERCENT)}
      aria-valuetext={valueText}
      data-dragging={drag.dragging ? '' : undefined}
      onPointerDown={drag.onPointerDown}
      onKeyDown={handleKeyDown}
      onKeyUp={session.releaseKey}
      onBlur={session.releaseFocus}
    >
      <span
        className={styles.marker}
        style={{
          left: `${String(value.s * PERCENT)}%`,
          top: `${String((1 - value.v) * PERCENT)}%`,
        }}
      />
    </div>
  );
}
