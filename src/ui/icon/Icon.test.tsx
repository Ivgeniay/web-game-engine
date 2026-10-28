import { cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { unknownIcon } from '@/icons/framework/unknown';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { defineIcon, defineIcons, fillRect, iconRef, stroke } from '@/icons/icon';
import { Icon } from './Icon';

const MD_PATH = 'M7.5 2.5 V12.5';
const SM_PATH = 'M5.5 1.5 V10.5';

const exampleIcons = defineIcons({
  line: defineIcon({ md: [stroke(MD_PATH)], sm: [stroke(SM_PATH)] }),
  dot: defineIcon({ md: [fillRect(7, 7, 1, 1)] }),
});

function renderedSvg(container: HTMLElement): SVGSVGElement {
  const svg = container.querySelector('svg');

  if (svg === null) {
    throw new Error('Icon did not render an svg element');
  }

  return svg;
}

function pathsOf(svg: SVGSVGElement): (string | null)[] {
  return [...svg.querySelectorAll('path')].map((path) => path.getAttribute('d'));
}

const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

beforeEach(() => {
  warn.mockClear();
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

describe('Icon', () => {
  it('is decorative and painted with the text color', () => {
    const svg = renderedSvg(render(<Icon icon={frameworkIcons.close} />).container);

    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('focusable')).toBe('false');
    expect(svg.getAttribute('fill')).toBe('none');
    expect(svg.getAttribute('stroke')).toBe('currentColor');
    expect(svg.getAttribute('stroke-linecap')).toBe('square');
    expect(svg.getAttribute('stroke-linejoin')).toBe('miter');
  });

  it('draws the 16 pixel drawing by default', () => {
    const svg = renderedSvg(render(<Icon icon={exampleIcons.line} />).container);

    expect(svg.getAttribute('viewBox')).toBe('0 0 16 16');
    expect(pathsOf(svg)).toEqual([MD_PATH]);
  });

  it('draws the 12 pixel drawing at the small size when the icon has one', () => {
    const svg = renderedSvg(render(<Icon icon={exampleIcons.line} size="sm" />).container);

    expect(svg.getAttribute('viewBox')).toBe('0 0 12 12');
    expect(pathsOf(svg)).toEqual([SM_PATH]);
  });

  it('scales the 16 pixel drawing at the small size when the icon has no small drawing', () => {
    const svg = renderedSvg(render(<Icon icon={frameworkIcons.close} size="sm" />).container);

    expect(svg.getAttribute('viewBox')).toBe('0 0 16 16');
  });

  it('fills filled rects with the text color', () => {
    const svg = renderedSvg(render(<Icon icon={exampleIcons.dot} />).container);
    const rect = svg.querySelector('rect');

    expect(rect?.getAttribute('fill')).toBe('currentColor');
    expect(rect?.getAttribute('stroke')).toBe('none');
  });

  it('draws an icon found by name', () => {
    const svg = renderedSvg(render(<Icon icon={iconRef(exampleIcons, 'line')} />).container);

    expect(pathsOf(svg)).toEqual([MD_PATH]);
    expect(warn).not.toHaveBeenCalled();
  });

  it('draws the unknown placeholder and warns once for a missing name', () => {
    const { container, rerender } = render(<Icon icon={iconRef(exampleIcons, 'teleport')} />);

    rerender(<Icon icon={iconRef(exampleIcons, 'teleport')} />);

    expect(pathsOf(renderedSvg(container))).toHaveLength(unknownIcon.md.length);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('"teleport"'));
  });

  it('does not warn about a missing name outside development', () => {
    vi.stubEnv('DEV', false);

    const svg = renderedSvg(render(<Icon icon={iconRef(exampleIcons, 'teleport')} />).container);

    expect(pathsOf(svg)).toHaveLength(unknownIcon.md.length);
    expect(warn).not.toHaveBeenCalled();
  });
});
