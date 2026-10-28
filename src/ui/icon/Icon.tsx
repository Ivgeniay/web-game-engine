import { useEffect } from 'react';
import { ICON_GRID_SIZES } from '@/icons/icon';
import type { IconShape, IconSize, IconSource } from '@/icons/icon';
import { resolveIcon } from '@/icons/resolveIcon';
import styles from './Icon.module.css';

interface IconProps {
  readonly icon: IconSource;
  readonly size?: IconSize;
}

const STROKE_WIDTH = 1;

function viewBox(gridSize: number): string {
  return `0 0 ${String(gridSize)} ${String(gridSize)}`;
}

function renderShape(shape: IconShape, index: number) {
  switch (shape.kind) {
    case 'stroke':
      return <path key={index} d={shape.d} />;
    case 'circle':
      return <circle key={index} cx={shape.cx} cy={shape.cy} r={shape.r} />;
    case 'fill-rect':
      return (
        <rect
          key={index}
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          fill="currentColor"
          stroke="none"
        />
      );
  }
}

export function Icon({ icon, size = 'md' }: IconProps) {
  const { definition, missingName } = resolveIcon(icon);

  useEffect(() => {
    if (import.meta.env.DEV && missingName !== undefined) {
      console.warn(`Unknown icon "${missingName}", the "unknown" placeholder is shown instead.`);
    }
  }, [missingName]);

  const smallDrawing = size === 'sm' ? definition.sm : undefined;
  const drawing = smallDrawing ?? definition.md;
  const gridSize = smallDrawing === undefined ? ICON_GRID_SIZES.md : ICON_GRID_SIZES.sm;

  return (
    <svg
      className={styles[size]}
      viewBox={viewBox(gridSize)}
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE_WIDTH}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
    >
      {drawing.map(renderShape)}
    </svg>
  );
}
