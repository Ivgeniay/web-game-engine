import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ValueChangeHandler, ValueChangePhase } from '@/contracts/valueChange';
import { VALUE_DRAG_THRESHOLD } from '@/ui/valueDrag/valueDragSession';
import { VECTOR2_AXES, VECTOR3_AXES } from './vectorAxes';
import { VectorField } from './VectorField';
import type { VectorComponentChangeHandler } from './VectorField';

const GROUP_LABEL = 'Position';
const SIZE_LABEL = 'Size';
const MESSAGES = { incomplete: 'Enter a number', belowMin: 'Too small', aboveMax: 'Too large' };
const POINTER_ID = 1;
const START_X = 50;

interface HarnessProps {
  readonly initial?: readonly number[];
  readonly mixed?: readonly boolean[];
  readonly disabled?: boolean;
  readonly onValueChange?: ValueChangeHandler<readonly number[]>;
  readonly onComponentChange?: VectorComponentChangeHandler;
}

function Harness({
  initial = [1, 2, 3],
  mixed,
  disabled,
  onValueChange,
  onComponentChange,
}: HarnessProps) {
  const [value, setValue] = useState(initial);

  return (
    <>
      <span id="caption">{GROUP_LABEL}</span>
      <VectorField
        aria-labelledby="caption"
        id="first"
        axes={VECTOR3_AXES}
        value={value}
        mixed={mixed}
        disabled={disabled}
        step={1}
        invalidMessages={MESSAGES}
        onValueChange={(next: readonly number[], phase: ValueChangePhase) => {
          setValue(next);
          onValueChange?.(next, phase);
        }}
        onComponentChange={onComponentChange}
      />
    </>
  );
}

function component(axis: string): HTMLInputElement {
  const element = screen.getByRole('spinbutton', { name: `${GROUP_LABEL} ${axis}` });

  if (!(element instanceof HTMLInputElement)) {
    throw new Error('VectorField did not render an input element');
  }

  return element;
}

function axisLabel(axis: string): HTMLElement {
  return screen.getByText(axis, { selector: 'label' });
}

function dragAxis(axis: string, offset: number): void {
  fireEvent.pointerDown(axisLabel(axis), { button: 0, pointerId: POINTER_ID, clientX: START_X });
  fireEvent.pointerMove(axisLabel(axis), {
    pointerId: POINTER_ID,
    clientX: START_X + VALUE_DRAG_THRESHOLD,
  });
  fireEvent.pointerMove(axisLabel(axis), {
    pointerId: POINTER_ID,
    clientX: START_X + VALUE_DRAG_THRESHOLD + offset,
  });
}

beforeEach(() => {
  Object.assign(HTMLElement.prototype, {
    setPointerCapture: vi.fn(),
    releasePointerCapture: vi.fn(),
    hasPointerCapture: vi.fn(() => true),
  });
});

afterEach(() => {
  cleanup();
});

describe('VectorField', () => {
  it('renders a named group with one field per axis', () => {
    render(<Harness />);

    expect(screen.getByRole('group', { name: GROUP_LABEL })).toBeDefined();
    expect([component('X').value, component('Y').value, component('Z').value]).toEqual([
      '1',
      '2',
      '3',
    ]);
    expect(component('X').id).toBe('first');
  });

  it('commits the whole vector after editing one component', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    await user.clear(component('Y'));
    await user.type(component('Y'), '5{Enter}');

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith([1, 5, 3], 'commit');
  });

  it('gives every component its own Tab stop from left to right', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.tab();
    expect(document.activeElement).toBe(component('X'));
    await user.tab();
    expect(document.activeElement).toBe(component('Y'));
    await user.tab();
    expect(document.activeElement).toBe(component('Z'));
  });

  it('focuses the component on a click on its axis label', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(axisLabel('Z'));

    expect(document.activeElement).toBe(component('Z'));
  });

  it('drags one component by its axis label', () => {
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    dragAxis('Z', 4);
    fireEvent.pointerUp(axisLabel('Z'), { pointerId: POINTER_ID });

    expect(onValueChange).toHaveBeenLastCalledWith([1, 2, 7], 'commit');
    expect(component('Z').value).toBe('7');
    expect(component('X').value).toBe('1');
  });

  it('cancels a drag on Esc', () => {
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    dragAxis('X', 4);
    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onValueChange).toHaveBeenLastCalledWith([1, 2, 3], 'cancel');
    expect(component('X').value).toBe('1');
  });

  it('shows a mixed value for each component separately', () => {
    render(<Harness mixed={[false, true, false]} />);

    expect(component('X').value).toBe('1');
    expect(component('Y').value).toBe('');
    expect(component('Z').value).toBe('3');
  });

  it('turns off typing and dragging when disabled', () => {
    const onValueChange = vi.fn();
    render(<Harness disabled onValueChange={onValueChange} />);

    dragAxis('X', 4);

    expect(component('X').disabled).toBe(true);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('names components by the group label and the axis', () => {
    render(
      <VectorField
        aria-label={SIZE_LABEL}
        axes={VECTOR2_AXES}
        value={[1, 2]}
        invalidMessages={MESSAGES}
      />,
    );

    expect(screen.getByRole('group', { name: SIZE_LABEL })).toBeDefined();
    expect(screen.getByRole('spinbutton', { name: `${SIZE_LABEL} X` })).toBeDefined();
  });

  it('reports the edited component even when it is typed equal to the shown value', async () => {
    const user = userEvent.setup();
    const onComponentChange = vi.fn();
    render(<Harness mixed={[false, true, false]} onComponentChange={onComponentChange} />);

    await user.type(component('Y'), '2{Enter}');

    expect(onComponentChange).toHaveBeenCalledExactlyOnceWith(1, 2, 'commit');
  });
});
