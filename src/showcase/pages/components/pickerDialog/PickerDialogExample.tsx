import { useState } from 'react';
import type { Color } from '@/contracts/color';
import type { ThumbnailLoader } from '@/contracts/thumbnail';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { usePickerDialogLabels } from '@/state/fields/usePickerDialogLabels';
import { Button } from '@/ui/button/Button';
import { cssColor } from '@/ui/color/colorModel';
import { Label } from '@/ui/label/Label';
import { PickerDialog } from '@/ui/pickerDialog/PickerDialog';
import type { PickerTab } from '@/ui/pickerDialog/PickerDialog';
import styles from './PickerDialogExample.module.css';

const OPEN_LABEL = 'Choose a skybox';
const TITLE = 'Select Skybox';
const CHOSEN_LABEL = 'Skybox: ';
const NONE_LABEL = 'None';
const PREVIEW_SIZE = 64;

const SKYBOXES: Readonly<
  Record<string, { readonly name: string; readonly top: Color; readonly bottom: Color }>
> = {
  day: {
    name: 'Day',
    top: { r: 0.3, g: 0.6, b: 1, a: 1 },
    bottom: { r: 0.85, g: 0.93, b: 1, a: 1 },
  },
  sunset: {
    name: 'Sunset',
    top: { r: 0.35, g: 0.2, b: 0.55, a: 1 },
    bottom: { r: 1, g: 0.6, b: 0.3, a: 1 },
  },
  night: {
    name: 'Night',
    top: { r: 0.02, g: 0.03, b: 0.12, a: 1 },
    bottom: { r: 0.15, g: 0.2, b: 0.4, a: 1 },
  },
  storm: {
    name: 'Storm',
    top: { r: 0.25, g: 0.27, b: 0.3, a: 1 },
    bottom: { r: 0.5, g: 0.52, b: 0.55, a: 1 },
  },
};

const TABS: readonly PickerTab[] = [
  { id: 'assets', label: 'Assets', getItemIds: () => Object.keys(SKYBOXES) },
  { id: 'scene', label: 'Scene', getItemIds: () => ['day'] },
];

function skyboxName(id: string): string {
  return SKYBOXES[id]?.name ?? id;
}

const loadSkyboxPreview: ThumbnailLoader = (id) => {
  const skybox = SKYBOXES[id];
  const canvas = document.createElement('canvas');
  canvas.width = PREVIEW_SIZE;
  canvas.height = PREVIEW_SIZE;
  const context = canvas.getContext('2d');

  if (skybox === undefined || context === null) {
    return Promise.reject(new Error(`No preview for ${id}`));
  }

  const gradient = context.createLinearGradient(0, 0, 0, PREVIEW_SIZE);
  gradient.addColorStop(0, cssColor(skybox.top));
  gradient.addColorStop(1, cssColor(skybox.bottom));
  context.fillStyle = gradient;
  context.fillRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);

  return Promise.resolve(canvas.toDataURL());
};

export function PickerDialogExample() {
  const labels = usePickerDialogLabels();
  const [skybox, setSkybox] = useState<string | null>('day');
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.root}>
      <Label>{CHOSEN_LABEL + (skybox === null ? NONE_LABEL : skyboxName(skybox))}</Label>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        {OPEN_LABEL}
      </Button>
      <PickerDialog
        open={open}
        title={TITLE}
        value={skybox}
        tabs={TABS}
        getLabel={skyboxName}
        getIcon={() => frameworkIcons.file}
        loadThumbnail={loadSkyboxPreview}
        labels={labels}
        onValueChange={setSkybox}
        onClose={() => {
          setOpen(false);
        }}
      />
    </div>
  );
}
