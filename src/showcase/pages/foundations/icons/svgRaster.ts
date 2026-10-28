export interface SvgRasterOptions {
  readonly pixelSize: number;
  readonly color: string;
  readonly outlineWidth?: number;
}

const SVG_MIME_TYPE = 'image/svg+xml';

function prepareClone(svg: SVGSVGElement, options: SvgRasterOptions): SVGSVGElement {
  const clone = svg.cloneNode(true);

  if (!(clone instanceof SVGSVGElement)) {
    throw new Error('Cannot clone the icon svg');
  }

  clone.removeAttribute('class');
  clone.setAttribute('width', String(options.pixelSize));
  clone.setAttribute('height', String(options.pixelSize));
  clone.setAttribute('color', options.color);

  if (options.outlineWidth !== undefined) {
    clone.setAttribute('stroke-width', String(options.outlineWidth));
    clone.setAttribute('stroke-linecap', 'butt');

    for (const rect of clone.querySelectorAll('rect')) {
      rect.setAttribute('fill', 'none');
      rect.setAttribute('stroke', 'currentColor');
    }
  }

  return clone;
}

export function rasterizeSvg(
  svg: SVGSVGElement,
  options: SvgRasterOptions,
): Promise<HTMLImageElement> {
  const markup = new XMLSerializer().serializeToString(prepareClone(svg, options));
  const url = URL.createObjectURL(new Blob([markup], { type: SVG_MIME_TYPE }));
  const image = new Image();

  return new Promise((resolve, reject) => {
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Cannot rasterize the icon svg'));
    };
    image.src = url;
  });
}
