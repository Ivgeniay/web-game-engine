import type { Color } from '@/contracts/color';
import type { ThumbnailLoader } from '@/contracts/thumbnail';
import { cssColor } from '@/ui/color/colorModel';

type MeshShape = 'capsule' | 'boulder' | 'box' | 'lamp';

const PREVIEW_SIZE = 96;
const PREVIEW_DELAY_MS = 250;
const MARGIN = 12;
const SHADE = 0.55;
const FULL_TURN = Math.PI * 2;

const MATERIAL_COLORS: Readonly<Record<string, Color>> = {
  'Assets/Materials/Ground.mat': { r: 0.45, g: 0.33, b: 0.2, a: 1 },
  'Assets/Materials/Rock.mat': { r: 0.55, g: 0.56, b: 0.6, a: 1 },
  'Assets/Materials/Player.mat': { r: 0.2, g: 0.45, b: 0.9, a: 1 },
};

const MESH_SHAPES: Readonly<Record<string, MeshShape>> = {
  'Assets/Models/Characters/Player.fbx': 'capsule',
  'Assets/Models/Characters/Goblin.fbx': 'capsule',
  'Assets/Models/Props/Rock.fbx': 'boulder',
  'Assets/Models/Props/Lamp.fbx': 'lamp',
  'Assets/Models/Props/Crate.fbx': 'box',
};

const MESH_COLOR: Color = { r: 0.78, g: 0.78, b: 0.8, a: 1 };

function darker({ r, g, b, a }: Color): Color {
  return { r: r * SHADE, g: g * SHADE, b: b * SHADE, a };
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

function drawMaterial(context: CanvasRenderingContext2D, color: Color): void {
  const middle = PREVIEW_SIZE / 2;
  const radius = middle - MARGIN;
  const gradient = context.createRadialGradient(
    middle - radius / 3,
    middle - radius / 3,
    radius / 8,
    middle,
    middle,
    radius,
  );

  gradient.addColorStop(0, cssColor(color));
  gradient.addColorStop(1, cssColor(darker(color)));
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(middle, middle, radius, 0, FULL_TURN);
  context.fill();
}

function drawMesh(context: CanvasRenderingContext2D, shape: MeshShape): void {
  const middle = PREVIEW_SIZE / 2;
  const near = MARGIN;
  const far = PREVIEW_SIZE - MARGIN;

  context.fillStyle = cssColor(MESH_COLOR);
  context.beginPath();

  switch (shape) {
    case 'capsule':
      context.roundRect(middle - MARGIN * 1.5, near, MARGIN * 3, far - near, MARGIN * 1.5);
      break;
    case 'boulder':
      context.ellipse(
        middle,
        middle + MARGIN / 2,
        middle - MARGIN,
        middle - MARGIN * 2,
        0,
        0,
        FULL_TURN,
      );
      break;
    case 'box':
      context.rect(near + MARGIN / 2, near + MARGIN / 2, far - near - MARGIN, far - near - MARGIN);
      break;
    case 'lamp':
      context.rect(middle - MARGIN / 4, near + MARGIN, MARGIN / 2, far - near - MARGIN);
      context.moveTo(middle + MARGIN, near + MARGIN / 2);
      context.arc(middle, near + MARGIN / 2, MARGIN, 0, FULL_TURN);
      break;
  }

  context.fill();
}

function drawPreview(path: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = PREVIEW_SIZE;
  canvas.height = PREVIEW_SIZE;
  const context = canvas.getContext('2d');
  const material = MATERIAL_COLORS[path];
  const mesh = MESH_SHAPES[path];

  if (context === null || (material === undefined && mesh === undefined)) {
    throw new Error(`No preview for ${path}`);
  }

  if (material !== undefined) {
    drawMaterial(context, material);
  } else if (mesh !== undefined) {
    drawMesh(context, mesh);
  }

  return canvas.toDataURL();
}

export function createAssetPreviewLoader(): ThumbnailLoader {
  const cache = new Map<string, string>();

  return async (path, signal) => {
    const cached = cache.get(path);

    if (cached !== undefined) {
      return cached;
    }

    await wait(PREVIEW_DELAY_MS, signal);
    const url = drawPreview(path);
    cache.set(path, url);

    return url;
  };
}
