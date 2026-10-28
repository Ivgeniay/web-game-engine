import { useRef } from 'react';
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import { classNames } from '@/ui/classNames';
import { readPixelToken } from '@/ui/popup/popupPosition';
import styles from './PropertyRowGroup.module.css';

interface PropertyRowGroupProps {
  readonly children: ReactNode;
  readonly className?: string | undefined;
}

const PRIMARY_BUTTON = 0;
const LABEL_WIDTH_PROPERTY = '--property-label-width';
const LABEL_MIN_TOKEN = '--size-property-label-min';
const FIELD_MIN_TOKEN = '--size-property-field-min';
const HALF = 2;

export function PropertyRowGroup({ children, className }: PropertyRowGroupProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  function startResize(event: ReactPointerEvent<HTMLDivElement>): void {
    const root = rootRef.current;

    if (root === null || event.button !== PRIMARY_BUTTON) {
      return;
    }

    event.preventDefault();

    const splitter = event.currentTarget;
    const pointerId = event.pointerId;
    const startX = event.clientX;
    const startWidth = splitter.offsetLeft + splitter.offsetWidth / HALF;
    const minWidth = readPixelToken(LABEL_MIN_TOKEN);
    const maxWidth = root.clientWidth - readPixelToken(FIELD_MIN_TOKEN);

    function handleMove(moveEvent: PointerEvent): void {
      const width = Math.min(Math.max(startWidth + moveEvent.clientX - startX, minWidth), maxWidth);
      root?.style.setProperty(LABEL_WIDTH_PROPERTY, `${String(width)}px`);
    }

    function handleEnd(): void {
      splitter.removeEventListener('pointermove', handleMove);
      splitter.removeEventListener('pointerup', handleEnd);
      splitter.removeEventListener('pointercancel', handleEnd);

      if (splitter.hasPointerCapture(pointerId)) {
        splitter.releasePointerCapture(pointerId);
      }
    }

    splitter.setPointerCapture(pointerId);
    splitter.addEventListener('pointermove', handleMove);
    splitter.addEventListener('pointerup', handleEnd);
    splitter.addEventListener('pointercancel', handleEnd);
  }

  return (
    <div ref={rootRef} className={classNames(styles.root, className)}>
      {children}
      <div className={styles.splitter} aria-hidden onPointerDown={startResize} />
    </div>
  );
}
