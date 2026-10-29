import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { RectField } from './RectField';
import type { Rect, RectMixed } from './RectField';

const LABEL = 'Viewport';
const MESSAGES = { incomplete: 'Enter a number', belowMin: 'Too small', aboveMax: 'Too large' };
const INITIAL: Rect = { x: 0, y: 0, width: 1, height: 0.5 };

interface HarnessProps {
  readonly mixed?: RectMixed;
  readonly disabled?: boolean;
  readonly onValueChange?: ValueChangeHandler<Rect>;
}

function Harness({ mixed, disabled, onValueChange }: HarnessProps) {
  const [rect, setRect] = useState(INITIAL);

  return (
    <RectField
      aria-label={LABEL}
      value={rect}
      mixed={mixed}
      disabled={disabled}
      invalidMessages={MESSAGES}
      onValueChange={(next, phase) => {
        setRect(next);
        onValueChange?.(next, phase);
      }}
    />
  );
}

function component(axis: string): HTMLInputElement {
  const element = screen.getByRole('spinbutton', { name: `${LABEL} ${axis}` });

  if (!(element instanceof HTMLInputElement)) {
    throw new Error(`No component ${axis}`);
  }

  return element;
}

afterEach(() => {
  cleanup();
});

describe('RectField', () => {
  it('shows position and size in two rows in a labelled group', () => {
    render(<Harness />);

    expect(screen.getAllByRole('group', { name: LABEL })).toHaveLength(3);
    expect(['X', 'Y', 'W', 'H'].map((axis) => component(axis).value)).toEqual([
      '0',
      '0',
      '1',
      '0.5',
    ]);
  });

  it('replaces one component of the rectangle', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    await user.clear(component('H'));
    await user.type(component('H'), '2{Enter}');

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ ...INITIAL, height: 2 }, 'commit');

    await user.clear(component('X'));
    await user.type(component('X'), '3{Enter}');

    expect(onValueChange).toHaveBeenLastCalledWith({ ...INITIAL, x: 3, height: 2 }, 'commit');
  });

  it('goes through the components in Tab order', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.tab();
    await user.tab();
    await user.tab();

    expect(document.activeElement).toBe(component('W'));
  });

  it('shows mixed components with a dash and disables all', () => {
    const { unmount } = render(<Harness mixed={{ width: true }} />);

    expect(component('W').placeholder).toBe('—');
    expect(component('X').placeholder).toBe('');
    unmount();

    render(<Harness disabled />);

    expect(component('Y').disabled).toBe(true);
    expect(component('H').disabled).toBe(true);
  });
});
