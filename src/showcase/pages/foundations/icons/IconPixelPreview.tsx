import { useEffect, useRef } from 'react';
import type { IconDefinition, IconSize } from '@/icons/icon';
import { useMessages } from '@/state/language/useMessages';
import { useThemeStore } from '@/state/theme/useThemeStore';
import { Icon } from '@/ui/icon/Icon';
import { iconsPageMessages } from './iconsPageMessages';
import styles from './IconPixelPreview.module.css';
import { rasterizeSvg } from './svgRaster';
import type { SvgRasterOptions } from './svgRaster';

interface IconPixelPreviewProps {
  readonly icon: IconDefinition;
  readonly size: IconSize;
  readonly showOutline: boolean;
}

const OUTLINE_CSS_WIDTH = 1;

function clearCanvas(canvas: HTMLCanvasElement): void {
  canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
}

function paint(
  canvas: HTMLCanvasElement,
  svg: SVGSVGElement,
  options: SvgRasterOptions,
  isCancelled: () => boolean,
): void {
  void rasterizeSvg(svg, options).then(
    (image) => {
      if (isCancelled()) {
        return;
      }

      canvas.width = options.pixelSize;
      canvas.height = options.pixelSize;
      canvas.getContext('2d')?.drawImage(image, 0, 0, options.pixelSize, options.pixelSize);
    },
    () => {
      if (!isCancelled()) {
        clearCanvas(canvas);
      }
    },
  );
}

function rasterOptions(svg: SVGSVGElement): SvgRasterOptions {
  return {
    pixelSize: Math.round(svg.getBoundingClientRect().width),
    color: getComputedStyle(svg).color,
  };
}

function outlineOptions(svg: SVGSVGElement, canvas: HTMLCanvasElement): SvgRasterOptions {
  const cssSize = canvas.getBoundingClientRect().width;

  return {
    pixelSize: Math.round(cssSize * window.devicePixelRatio),
    color: getComputedStyle(canvas).color,
    outlineWidth: (svg.viewBox.baseVal.width / cssSize) * OUTLINE_CSS_WIDTH,
  };
}

export function IconPixelPreview({ icon, size, showOutline }: IconPixelPreviewProps) {
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
  const t = useMessages(iconsPageMessages);
  const sourceRef = useRef<HTMLDivElement>(null);
  const rasterRef = useRef<HTMLCanvasElement>(null);
  const outlineRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const svg = sourceRef.current?.querySelector('svg');
    const raster = rasterRef.current;
    const outline = outlineRef.current;

    if (svg === null || svg === undefined || raster === null || outline === null) {
      return undefined;
    }

    let cancelled = false;
    const isCancelled = () => cancelled;

    paint(raster, svg, rasterOptions(svg), isCancelled);
    clearCanvas(outline);

    if (showOutline) {
      paint(outline, svg, outlineOptions(svg, outline), isCancelled);
    }

    return () => {
      cancelled = true;
    };
  }, [icon, size, showOutline, resolvedTheme]);

  return (
    <figure className={styles.root}>
      <div className={styles.views}>
        <div className={styles[size]}>
          <canvas ref={rasterRef} className={styles.raster} />
          <div className={styles.grid} />
          <canvas ref={outlineRef} className={styles.outline} />
        </div>
        <div ref={sourceRef} className={styles.actual}>
          <Icon icon={icon} size={size} />
        </div>
      </div>
      <figcaption className={styles.note}>{t('galleryDensityNote')}</figcaption>
    </figure>
  );
}
