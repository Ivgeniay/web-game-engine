import { useState } from 'react';
import type { Color } from '@/contracts/color';
import type { ThumbnailLoader } from '@/contracts/thumbnail';
import { defineMessages } from '@/core/i18n/messages';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { useMessages } from '@/state/language/useMessages';
import { Button } from '@/ui/button/Button';
import { cssColor } from '@/ui/color/colorModel';
import { Label } from '@/ui/label/Label';
import { Thumbnail } from '@/ui/thumbnail/Thumbnail';
import styles from './ThumbnailExample.module.css';

const previewMessages = defineMessages({
  en: {
    loading: 'Loading',
    loaded: 'Loaded',
    failed: 'Failed to load',
    reload: 'Load again',
  },
  ru: {
    loading: 'Загружается',
    loaded: 'Загружено',
    failed: 'Ошибка загрузки',
    reload: 'Загрузить заново',
  },
});

type PreviewStatus = 'loading' | 'loaded' | 'failed';
type Shape = 'circle' | 'square' | 'triangle';

interface Texture {
  readonly id: string;
  readonly shape: Shape;
  readonly color: Color;
  readonly delay: number;
  readonly broken: boolean;
}

const TEXTURES: readonly Texture[] = [
  { id: 'sun', shape: 'circle', color: { r: 1, g: 0.75, b: 0.2, a: 1 }, delay: 300, broken: false },
  {
    id: 'grass',
    shape: 'square',
    color: { r: 0.3, g: 0.75, b: 0.35, a: 1 },
    delay: 1500,
    broken: false,
  },
  {
    id: 'water',
    shape: 'triangle',
    color: { r: 0.25, g: 0.55, b: 1, a: 1 },
    delay: 800,
    broken: true,
  },
];

const PREVIEW_SIZE = 64;
const SHAPE_MARGIN = 8;

function wait(milliseconds: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, milliseconds);

    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new Error('The preview is not needed any more'));
    });
  });
}

function drawShape(context: CanvasRenderingContext2D, shape: Shape): void {
  const near = SHAPE_MARGIN;
  const far = PREVIEW_SIZE - SHAPE_MARGIN;
  const middle = PREVIEW_SIZE / 2;

  context.beginPath();

  switch (shape) {
    case 'circle':
      context.arc(middle, middle, middle - SHAPE_MARGIN, 0, Math.PI * 2);
      break;
    case 'square':
      context.rect(near, near, far - near, far - near);
      break;
    case 'triangle':
      context.moveTo(middle, near);
      context.lineTo(far, far);
      context.lineTo(near, far);
      context.closePath();
      break;
  }

  context.fill();
}

async function drawTexture(texture: Texture, signal: AbortSignal): Promise<string> {
  await wait(texture.delay, signal);

  const canvas = document.createElement('canvas');
  canvas.width = PREVIEW_SIZE;
  canvas.height = PREVIEW_SIZE;
  const context = canvas.getContext('2d');

  if (context === null || texture.broken) {
    throw new Error(`No preview for ${texture.id}`);
  }

  context.fillStyle = cssColor(texture.color);
  drawShape(context, texture.shape);

  return canvas.toDataURL();
}

function createLoader(onStatus: (id: string, status: PreviewStatus) => void): ThumbnailLoader {
  return async (id, signal) => {
    const texture = TEXTURES.find((candidate) => candidate.id === id);

    if (texture === undefined) {
      throw new Error(`Unknown texture ${id}`);
    }

    onStatus(id, 'loading');

    try {
      const url = await drawTexture(texture, signal);
      onStatus(id, 'loaded');

      return url;
    } catch (error) {
      if (!signal.aborted) {
        onStatus(id, 'failed');
      }

      throw error;
    }
  };
}

export function ThumbnailExample() {
  const t = useMessages(previewMessages);
  const [attempt, setAttempt] = useState(0);
  const [statuses, setStatuses] = useState<Readonly<Record<string, PreviewStatus>>>({});
  const [load] = useState(() =>
    createLoader((id, status) => {
      setStatuses((current) => ({ ...current, [id]: status }));
    }),
  );

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        {TEXTURES.map(({ id }) => (
          <div key={`${id}-${String(attempt)}`} className={styles.cell}>
            <Thumbnail
              className={styles.thumbnail}
              id={id}
              load={load}
              placeholder={frameworkIcons.file}
            />
            <Label tone="secondary">{t(statuses[id] ?? 'loading')}</Label>
          </div>
        ))}
      </div>
      <Button
        onClick={() => {
          setStatuses({});
          setAttempt((current) => current + 1);
        }}
      >
        {t('reload')}
      </Button>
    </div>
  );
}
