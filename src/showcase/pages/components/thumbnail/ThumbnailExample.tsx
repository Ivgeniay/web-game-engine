import { useState } from 'react';
import type { ThumbnailLoader } from '@/contracts/thumbnail';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { Button } from '@/ui/button/Button';
import { Thumbnail } from '@/ui/thumbnail/Thumbnail';
import styles from './ThumbnailExample.module.css';

const RELOAD_LABEL = 'Load again';
const PREVIEW_SIZE = 64;
const MISSING_TEXTURE = 'texture-missing';
const ACCENT_TOKEN = '--color-accent';
const TEXTURES = ['texture-fast', 'texture-slow', MISSING_TEXTURE];
const DELAY_MS: Readonly<Record<string, number>> = {
  'texture-fast': 300,
  'texture-slow': 1500,
  [MISSING_TEXTURE]: 800,
};

function wait(milliseconds: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, milliseconds);

    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new Error('The preview is not needed any more'));
    });
  });
}

const loadTexturePreview: ThumbnailLoader = async (id, signal) => {
  await wait(DELAY_MS[id] ?? 0, signal);
  const canvas = document.createElement('canvas');
  canvas.width = PREVIEW_SIZE;
  canvas.height = PREVIEW_SIZE;
  const context = canvas.getContext('2d');

  if (context === null || id === MISSING_TEXTURE) {
    throw new Error(`No preview for ${id}`);
  }

  context.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue(ACCENT_TOKEN);
  context.lineWidth = PREVIEW_SIZE / 8;
  context.strokeRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);

  return canvas.toDataURL();
};

export function ThumbnailExample() {
  const [attempt, setAttempt] = useState(0);

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        {TEXTURES.map((id) => (
          <Thumbnail
            key={`${id}-${String(attempt)}`}
            className={styles.thumbnail}
            id={id}
            load={loadTexturePreview}
            placeholder={frameworkIcons.file}
          />
        ))}
      </div>
      <Button
        onClick={() => {
          setAttempt((current) => current + 1);
        }}
      >
        {RELOAD_LABEL}
      </Button>
    </div>
  );
}
