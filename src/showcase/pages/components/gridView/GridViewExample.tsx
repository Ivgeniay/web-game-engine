import { useState } from 'react';
import type { Color } from '@/contracts/color';
import type { ThumbnailLoader } from '@/contracts/thumbnail';
import { cssColor } from '@/ui/color/colorModel';
import { GridView } from '@/ui/gridView/GridView';
import {
  GRID_CELL_SIZE_DEFAULT,
  GRID_CELL_SIZE_MAX,
  GRID_CELL_SIZE_MIN,
} from '@/ui/gridView/gridScale';
import { useListViewState } from '@/ui/listView/useListViewState';
import { Slider } from '@/ui/slider/Slider';
import styles from './GridViewExample.module.css';

const ASSETS_LABEL = 'Materials';
const SCALE_LABEL = 'Icon size';
const MATERIAL_COUNT = 300;
const PREVIEW_SIZE = 64;
const PREVIEW_DELAY_MS = 400;
const HUE_STEP = 0.137;

const MATERIAL_IDS = Array.from(
  { length: MATERIAL_COUNT },
  (_, index) => `material-${String(index)}`,
);

function materialName(id: string): string {
  return id.replace('material-', 'Material ');
}

function materialColor(id: string): Color {
  const index = Number(id.replace('material-', ''));
  const hue = (index * HUE_STEP) % 1;

  return { r: hue, g: 1 - hue, b: 0.5 + hue / 2, a: 1 };
}

function wait(milliseconds: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, milliseconds);

    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new Error('The preview is not needed any more'));
    });
  });
}

const loadPreview: ThumbnailLoader = async (id, signal) => {
  await wait(PREVIEW_DELAY_MS, signal);
  const canvas = document.createElement('canvas');
  canvas.width = PREVIEW_SIZE;
  canvas.height = PREVIEW_SIZE;
  const context = canvas.getContext('2d');

  if (context === null) {
    throw new Error('Canvas is not available');
  }

  context.fillStyle = cssColor(materialColor(id));
  context.beginPath();
  context.arc(PREVIEW_SIZE / 2, PREVIEW_SIZE / 2, PREVIEW_SIZE / 2, 0, Math.PI * 2);
  context.fill();

  return canvas.toDataURL();
};

export function GridViewExample() {
  const state = useListViewState();
  const [cellSize, setCellSize] = useState(GRID_CELL_SIZE_DEFAULT);

  return (
    <div className={styles.root}>
      <GridView
        aria-label={ASSETS_LABEL}
        className={styles.grid}
        itemIds={MATERIAL_IDS}
        getLabel={materialName}
        loadThumbnail={loadPreview}
        cellSize={cellSize}
        selectionMode="multiple"
        {...state}
      />
      <Slider
        aria-label={SCALE_LABEL}
        className={styles.scale}
        value={cellSize}
        min={GRID_CELL_SIZE_MIN}
        max={GRID_CELL_SIZE_MAX}
        step={1}
        kind="integer"
        showField={false}
        onValueChange={setCellSize}
      />
    </div>
  );
}
