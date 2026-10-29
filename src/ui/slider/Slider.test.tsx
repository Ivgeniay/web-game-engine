import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { Toolbar } from '@/ui/toolbar/Toolbar';
import { Slider } from './Slider';
import type { SliderScale } from './sliderScale';

const LABEL = 'Intensity';
const TOOLBAR_LABEL = 'Tools';
const MESSAGES = { incomplete: 'Enter a number', belowMin: 'Too small', aboveMax: 'Too large' };
const RAIL_WIDTH = 100;
const POINTER_ID = 1;

interface HarnessProps {
  readonly initial?: number;
  readonly min?: number;
  readonly max?: number;
  readonly scale?: SliderScale;
  readonly mixed?: boolean;
  readonly disabled?: boolean;
  readonly readOnly?: boolean;
  readonly onValueChange?: ValueChangeHandler<number>;
}

function Harness({ initial = 5, min = 0, max = 10, onValueChange, ...props }: HarnessProps) {
  const [value, setValue] = useState(initial);

  return (
    <Slider
      {...props}
      aria-label={LABEL}
      value={value}
      min={min}
      max={max}
      invalidMessages={MESSAGES}
      onValueChange={(next, phase) => {
        setValue(next);
        onValueChange?.(next, phase);
      }}
    />
  );
}

function slider(): HTMLElement {
  return screen.getByRole('slider', { name: LABEL });
}

function numberField(): HTMLInputElement {
  const element = screen.getByRole('spinbutton', { name: LABEL });

  if (!(element instanceof HTMLInputElement)) {
    throw new Error('Slider did not render a number input');
  }

  return element;
}

function thumb(): Element | null {
  return slider().querySelector('[style]');
}

function pointerDown(clientX: number): void {
  fireEvent.pointerDown(slider(), { button: 0, pointerId: POINTER_ID, clientX });
}

function pointerMove(clientX: number): void {
  fireEvent.pointerMove(slider(), { pointerId: POINTER_ID, clientX });
}

function pointerUp(): void {
  fireEvent.pointerUp(slider(), { pointerId: POINTER_ID });
}

beforeEach(() => {
  Object.assign(HTMLElement.prototype, {
    setPointerCapture: vi.fn(),
    releasePointerCapture: vi.fn(),
    hasPointerCapture: vi.fn(() => true),
  });
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(
    DOMRect.fromRect({ x: 0, y: 0, width: RAIL_WIDTH, height: 4 }),
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Slider', () => {
  it('describes the value as a slider and shows it in a number field', () => {
    render(<Harness />);

    expect(slider().getAttribute('aria-valuenow')).toBe('5');
    expect(slider().getAttribute('aria-valuemin')).toBe('0');
    expect(slider().getAttribute('aria-valuemax')).toBe('10');
    expect(slider().getAttribute('aria-valuetext')).toBe('5');
    expect(slider().tabIndex).toBe(0);
    expect(numberField().value).toBe('5');
    expect(thumb()?.getAttribute('style')).toContain('left: 50%');
  });

  it('previews while dragging and commits once on release', () => {
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    pointerDown(25);
    pointerMove(70);
    pointerUp();

    expect(onValueChange.mock.calls).toEqual([
      [2.5, 'preview'],
      [7, 'preview'],
      [7, 'commit'],
    ]);
    expect(document.activeElement).toBe(slider());
    expect(numberField().value).toBe('7');
  });

  it('cancels a drag on Esc back to the value at its start', () => {
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    pointerDown(90);
    fireEvent.keyDown(window, { key: 'Escape' });
    pointerMove(10);
    pointerUp();

    expect(onValueChange.mock.calls).toEqual([
      [9, 'preview'],
      [5, 'cancel'],
    ]);
  });

  it('previews on every repeat of a held arrow and commits on key up', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    slider().focus();
    await user.keyboard('{ArrowRight>3}{/ArrowRight}');

    expect(onValueChange.mock.calls).toEqual([
      [5.1, 'preview'],
      [5.2, 'preview'],
      [5.3, 'preview'],
      [5.3, 'commit'],
    ]);
  });

  it('cancels a held key on Esc', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    slider().focus();
    await user.keyboard('{ArrowLeft>2}{Escape}{/ArrowLeft}');

    expect(onValueChange).toHaveBeenLastCalledWith(5, 'cancel');
    expect(onValueChange).not.toHaveBeenCalledWith(expect.anything(), 'commit');
  });

  it('jumps by page keys and to the edges on Home and End', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    slider().focus();
    await user.keyboard('{PageUp}');

    expect(onValueChange).toHaveBeenLastCalledWith(6, 'commit');

    await user.keyboard('{Home}');

    expect(onValueChange).toHaveBeenLastCalledWith(0, 'commit');

    await user.keyboard('{End}');

    expect(onValueChange).toHaveBeenLastCalledWith(10, 'commit');
    expect(slider().getAttribute('aria-valuenow')).toBe('10');
  });

  it('commits a typed number from the field', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    await user.clear(numberField());
    await user.type(numberField(), '3{Enter}');

    expect(onValueChange).toHaveBeenLastCalledWith(3, 'commit');
    expect(slider().getAttribute('aria-valuenow')).toBe('3');
  });

  it('places a logarithmic value by orders of magnitude', () => {
    const onValueChange = vi.fn();
    render(<Harness initial={10} min={1} max={1000} scale="log" onValueChange={onValueChange} />);

    expect(thumb()?.getAttribute('style')).toMatch(/left: 33\.3+\d*%/);

    pointerDown(RAIL_WIDTH * (2 / 3));
    pointerUp();

    expect(onValueChange).toHaveBeenLastCalledWith(100, 'commit');
  });

  it('hides the thumb for a mixed value and commits a click for every object', () => {
    const onValueChange = vi.fn();
    render(<Harness mixed onValueChange={onValueChange} />);

    expect(thumb()).toBeNull();
    expect(slider().getAttribute('aria-valuenow')).toBeNull();

    pointerDown(50);
    pointerUp();

    expect(onValueChange).toHaveBeenLastCalledWith(5, 'commit');
  });

  it('ignores the pointer and keys when read-only but stays focusable', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness readOnly onValueChange={onValueChange} />);

    pointerDown(90);
    pointerUp();
    slider().focus();
    await user.keyboard('{ArrowRight}');

    expect(onValueChange).not.toHaveBeenCalled();
    expect(slider().getAttribute('aria-readonly')).toBe('true');
    expect(document.activeElement).toBe(slider());
  });

  it('leaves the Tab order and ignores the pointer when disabled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness disabled onValueChange={onValueChange} />);

    pointerDown(90);
    await user.tab();

    expect(onValueChange).not.toHaveBeenCalled();
    expect(slider().getAttribute('aria-disabled')).toBe('true');
    expect(slider().hasAttribute('tabindex')).toBe(false);
    expect(document.activeElement).not.toBe(slider());
  });

  it('takes one roving stop in a toolbar next to its field', async () => {
    const user = userEvent.setup();
    render(
      <Toolbar label={TOOLBAR_LABEL}>
        <Harness />
      </Toolbar>,
    );

    await user.tab();

    expect(document.activeElement).toBe(slider());

    await user.keyboard('{ArrowRight}');

    expect(slider().getAttribute('aria-valuenow')).toBe('5.1');
  });
});
