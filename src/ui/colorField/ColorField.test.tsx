import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Color } from '@/contracts/color';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { Button } from '@/ui/button/Button';
import { TEST_COLOR_LABELS } from '@/ui/colorPicker/colorPickerTestLabels';
import { MIXED_VALUE_PLACEHOLDER } from '@/ui/textField/fieldBox';
import { ColorField } from './ColorField';

const LABEL = 'Light color';
const OUTSIDE = 'Outside';
const TEAL: Color = { r: 0, g: 0.5, b: 0.5, a: 0.5 };
const AREA_SIZE = 100;
const POINTER_ID = 1;

interface HarnessProps {
  readonly mixed?: boolean;
  readonly disabled?: boolean;
  readonly showAlpha?: boolean;
  readonly onValueChange?: ValueChangeHandler<Color>;
}

function Harness({ mixed = false, onValueChange, ...props }: HarnessProps) {
  const [color, setColor] = useState(TEAL);
  const [isMixed, setMixed] = useState(mixed);

  return (
    <>
      <ColorField
        {...props}
        aria-label={LABEL}
        value={color}
        mixed={isMixed}
        labels={TEST_COLOR_LABELS}
        onValueChange={(next, phase) => {
          setColor(next);

          if (phase === 'commit') {
            setMixed(false);
          }

          onValueChange?.(next, phase);
        }}
      />
      <Button>{OUTSIDE}</Button>
    </>
  );
}

function swatch(): HTMLElement {
  return screen.getByRole('button', { name: LABEL });
}

function picker(): HTMLElement | null {
  return screen.queryByRole('dialog', { name: TEST_COLOR_LABELS.picker });
}

function dragArea(clientX: number, clientY: number): void {
  const area = screen.getByRole('slider', { name: TEST_COLOR_LABELS.area });

  fireEvent.pointerDown(area, { button: 0, pointerId: POINTER_ID, clientX, clientY });
  fireEvent.pointerUp(area, { pointerId: POINTER_ID });
}

function phases(handler: ReturnType<typeof vi.fn>): unknown[] {
  return handler.mock.calls.map(([, phase]: unknown[]) => phase);
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

describe('ColorField', () => {
  it('shows the color as a swatch that opens the picker', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    expect(swatch().getAttribute('aria-haspopup')).toBe('dialog');
    expect(swatch().querySelector('[style*="background-color"]')).not.toBeNull();
    expect(swatch().querySelector('[style*="width: 50%"]')).not.toBeNull();

    await user.click(swatch());

    expect(picker()).not.toBeNull();
    await waitFor(() => {
      expect(document.activeElement).toBe(
        screen.getByRole('slider', { name: TEST_COLOR_LABELS.area }),
      );
    });
  });

  it('opens on Enter and Space', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    swatch().focus();
    await user.keyboard('{Enter}');

    expect(picker()).not.toBeNull();
  });

  it('turns every change in the picker into a preview and commits once on close', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    await user.click(swatch());
    dragArea(0, 0);
    dragArea(100, 0);

    expect(phases(onValueChange)).toEqual(['preview', 'preview', 'preview', 'preview']);

    await user.click(screen.getByRole('button', { name: OUTSIDE }));

    expect(picker()).toBeNull();
    expect(phases(onValueChange)).toHaveLength(5);
    expect(onValueChange).toHaveBeenLastCalledWith({ r: 0, g: 1, b: 1, a: 0.5 }, 'commit');
  });

  it('cancels the whole choice on Esc', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    await user.click(swatch());
    dragArea(0, 0);
    await user.keyboard('{Escape}');

    expect(picker()).toBeNull();
    expect(onValueChange).toHaveBeenLastCalledWith(TEAL, 'cancel');
    expect(onValueChange).not.toHaveBeenCalledWith(expect.anything(), 'commit');
  });

  it('reports nothing when the picker closes without a change', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    await user.click(swatch());
    await user.click(swatch());

    expect(picker()).toBeNull();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('shows a dash for a mixed color and commits a new one for every object', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness mixed onValueChange={onValueChange} />);

    expect(swatch().textContent).toBe(MIXED_VALUE_PLACEHOLDER);

    await user.click(swatch());
    dragArea(0, 0);
    await user.click(screen.getByRole('button', { name: OUTSIDE }));

    expect(onValueChange).toHaveBeenLastCalledWith({ r: 1, g: 1, b: 1, a: 0.5 }, 'commit');
    expect(swatch().textContent).toBe('');
  });

  it('keeps the color opaque without alpha', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness showAlpha={false} onValueChange={onValueChange} />);

    expect(swatch().querySelector('[style*="width"]')).toBeNull();

    await user.click(swatch());
    dragArea(0, 0);
    await user.click(screen.getByRole('button', { name: OUTSIDE }));

    expect(onValueChange).toHaveBeenLastCalledWith({ r: 1, g: 1, b: 1, a: 1 }, 'commit');
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    render(<Harness disabled />);

    await user.click(swatch());

    expect(picker()).toBeNull();
    expect(swatch().hasAttribute('disabled')).toBe(true);
  });

  it('commits a color from the eyedropper next to the swatch', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    vi.stubGlobal(
      'EyeDropper',
      class {
        open(): Promise<{ sRGBHex: string }> {
          return Promise.resolve({ sRGBHex: '#ff0000' });
        }
      },
    );
    render(<Harness onValueChange={onValueChange} />);

    await user.click(screen.getByRole('button', { name: TEST_COLOR_LABELS.eyedropper }));

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ r: 1, g: 0, b: 0, a: 0.5 }, 'commit');
  });
});
