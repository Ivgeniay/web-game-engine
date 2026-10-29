import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Color } from '@/contracts/color';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import type { ColorMode } from './colorChannels';
import { ColorPicker } from './ColorPicker';
import { TEST_COLOR_LABELS } from './colorPickerTestLabels';

const TEAL: Color = { r: 0, g: 0.5, b: 0.5, a: 0.5 };
const AREA_SIZE = 100;
const POINTER_ID = 1;

interface HarnessProps {
  readonly initial?: Color;
  readonly showAlpha?: boolean;
  readonly colorMode?: ColorMode;
  readonly onColorModeChange?: (mode: ColorMode) => void;
  readonly onValueChange?: ValueChangeHandler<Color>;
}

function Harness({ initial = TEAL, onValueChange, ...props }: HarnessProps) {
  const [color, setColor] = useState(initial);

  return (
    <ColorPicker
      {...props}
      value={color}
      labels={TEST_COLOR_LABELS}
      onValueChange={(next, phase) => {
        setColor(next);
        onValueChange?.(next, phase);
      }}
    />
  );
}

function slider(name: string): HTMLElement {
  return screen.getByRole('slider', { name });
}

function field(name: string): HTMLInputElement {
  const element = screen.getByRole('spinbutton', { name });

  if (!(element instanceof HTMLInputElement)) {
    throw new Error(`No number field ${name}`);
  }

  return element;
}

function hexField(): HTMLInputElement {
  const element = screen.getByRole('textbox', { name: TEST_COLOR_LABELS.hex });

  if (!(element instanceof HTMLInputElement)) {
    throw new Error('No hex field');
  }

  return element;
}

beforeEach(() => {
  Object.assign(HTMLElement.prototype, {
    setPointerCapture: vi.fn(),
    releasePointerCapture: vi.fn(),
    hasPointerCapture: vi.fn(() => true),
  });
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(
    DOMRect.fromRect({ x: 0, y: 0, width: AREA_SIZE, height: AREA_SIZE }),
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('ColorPicker', () => {
  it('shows the color in the area, the strips and the fields of the RGB model', () => {
    render(<Harness />);

    expect(slider(TEST_COLOR_LABELS.area).getAttribute('aria-roledescription')).toBe('2D slider');
    expect(slider(TEST_COLOR_LABELS.area).getAttribute('aria-valuetext')).toBe(
      'Saturation 100%, brightness 50%',
    );
    expect(slider(TEST_COLOR_LABELS.hue).getAttribute('aria-valuenow')).toBe('180');
    expect(slider(TEST_COLOR_LABELS.alpha).getAttribute('aria-valuenow')).toBe('50');
    expect(field('Green').value).toBe('128');
    expect(field('Alpha value').value).toBe('128');
    expect(hexField().value).toBe('00808080');
  });

  it('previews while dragging in the area and commits once on release', () => {
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);
    const area = slider(TEST_COLOR_LABELS.area);

    fireEvent.pointerDown(area, { button: 0, pointerId: POINTER_ID, clientX: 50, clientY: 50 });
    fireEvent.pointerMove(area, { pointerId: POINTER_ID, clientX: 0, clientY: 0 });
    fireEvent.pointerUp(area, { pointerId: POINTER_ID });

    expect(onValueChange.mock.calls.map(([, phase]: unknown[]) => phase)).toEqual([
      'preview',
      'preview',
      'commit',
    ]);
    expect(onValueChange).toHaveBeenLastCalledWith({ r: 1, g: 1, b: 1, a: 0.5 }, 'commit');
  });

  it('cancels a drag in the area on Esc', () => {
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);
    const area = slider(TEST_COLOR_LABELS.area);

    fireEvent.pointerDown(area, { button: 0, pointerId: POINTER_ID, clientX: 0, clientY: 0 });
    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onValueChange).toHaveBeenLastCalledWith(TEAL, 'cancel');
  });

  it('turns the hue with a held arrow and commits on key up', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness initial={{ r: 1, g: 0, b: 0, a: 1 }} onValueChange={onValueChange} />);

    slider(TEST_COLOR_LABELS.hue).focus();
    await user.keyboard('{Alt>}{ArrowRight>3}{/ArrowRight}{/Alt}');

    expect(onValueChange.mock.calls.map(([, phase]: unknown[]) => phase)).toEqual([
      'preview',
      'preview',
      'preview',
      'commit',
    ]);
    expect(slider(TEST_COLOR_LABELS.hue).getAttribute('aria-valuenow')).toBe('30');
  });

  it('moves saturation and brightness with the arrows in the area', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    slider(TEST_COLOR_LABELS.area).focus();
    await user.keyboard('{Alt>}{ArrowUp}{/Alt}');

    expect(slider(TEST_COLOR_LABELS.area).getAttribute('aria-valuetext')).toBe(
      'Saturation 100%, brightness 60%',
    );
    expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ a: 0.5 }), 'commit');
  });

  it('switches the model and keeps the hue of a gray color', async () => {
    const user = userEvent.setup();
    const onColorModeChange = vi.fn();
    render(<Harness onColorModeChange={onColorModeChange} />);

    await user.click(screen.getByRole('combobox', { name: TEST_COLOR_LABELS.model }));
    await user.click(screen.getByRole('option', { name: 'HSV' }));

    expect(onColorModeChange).toHaveBeenCalledExactlyOnceWith('hsv');
    expect(field('Hue value').value).toBe('180');

    await user.clear(field('Saturation'));
    await user.type(field('Saturation'), '0{Enter}');

    expect(field('Hue value').value).toBe('180');
    expect(slider(TEST_COLOR_LABELS.hue).getAttribute('aria-valuenow')).toBe('180');
  });

  it('follows a controlled color model', () => {
    render(<Harness colorMode="rgb1" />);

    expect(field('Green').value).toBe('0.5');
  });

  it('commits a hex color and rejects an invalid one', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    await user.clear(hexField());
    await user.type(hexField(), 'FF00');

    expect(hexField().getAttribute('aria-invalid')).toBe('true');

    await user.type(hexField(), '00{Enter}');

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ r: 1, g: 0, b: 0, a: 0.5 }, 'commit');
  });

  it('hides alpha when asked', () => {
    render(<Harness showAlpha={false} />);

    expect(screen.queryByRole('slider', { name: TEST_COLOR_LABELS.alpha })).toBeNull();
    expect(screen.queryByRole('spinbutton', { name: 'Alpha value' })).toBeNull();
    expect(hexField().value).toBe('008080');
  });

  it('shows the eyedropper only where the browser has it and commits its color', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { unmount } = render(<Harness />);

    expect(screen.queryByRole('button', { name: TEST_COLOR_LABELS.eyedropper })).toBeNull();
    unmount();

    vi.stubGlobal(
      'EyeDropper',
      class {
        open(): Promise<{ sRGBHex: string }> {
          return Promise.resolve({ sRGBHex: '#00ff00' });
        }
      },
    );
    render(<Harness onValueChange={onValueChange} />);

    await user.click(screen.getByRole('button', { name: TEST_COLOR_LABELS.eyedropper }));

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ r: 0, g: 1, b: 0, a: 0.5 }, 'commit');
  });
});
