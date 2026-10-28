import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ValueChangeHandler } from '@/contracts/valueChange';
import { LocaleContext } from '@/ui/locale/localeContext';
import type { TextFieldUpdateMode } from '@/ui/textField/TextField';
import { NumberField } from './NumberField';
import type { NumberKind } from './numberText';

const LABEL = 'Speed';
const MESSAGES = { incomplete: 'Enter a number', belowMin: 'Too small', aboveMax: 'Too large' };

interface HarnessProps {
  readonly initial?: number;
  readonly kind?: NumberKind;
  readonly min?: number;
  readonly max?: number;
  readonly updateMode?: TextFieldUpdateMode;
  readonly mixed?: boolean;
  readonly onValueChange?: ValueChangeHandler<number>;
}

function Harness({ initial = 1.5, onValueChange, ...props }: HarnessProps) {
  const [value, setValue] = useState(initial);

  return (
    <NumberField
      {...props}
      aria-label={LABEL}
      value={value}
      invalidMessages={MESSAGES}
      onValueChange={(next, phase) => {
        setValue(next);
        onValueChange?.(next, phase);
      }}
    />
  );
}

function field(): HTMLInputElement {
  const element = screen.getByRole('spinbutton', { name: LABEL });

  if (!(element instanceof HTMLInputElement)) {
    throw new Error('NumberField did not render an input element');
  }

  return element;
}

afterEach(() => {
  cleanup();
});

describe('NumberField', () => {
  it('shows the value as a spin button', () => {
    render(<Harness min={0} max={10} />);

    expect(field().value).toBe('1.5');
    expect(field().getAttribute('aria-valuenow')).toBe('1.5');
    expect(field().getAttribute('aria-valuemin')).toBe('0');
    expect(field().getAttribute('aria-valuemax')).toBe('10');
  });

  it('formats the value by the locale and reads both separators', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <LocaleContext value="ru">
        <Harness onValueChange={onValueChange} />
      </LocaleContext>,
    );

    expect(field().value).toBe('1,5');

    await user.clear(field());
    await user.type(field(), '2.25{Enter}');

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(2.25, 'commit');
    expect(field().value).toBe('2,25');
  });

  it('does not let a letter or a separator into an integer', async () => {
    const user = userEvent.setup();
    render(<Harness kind="integer" initial={12} />);

    await user.type(field(), 'a,.3');

    expect(field().value).toBe('123');
  });

  it('allows only one decimal separator', async () => {
    const user = userEvent.setup();
    render(<Harness initial={1} />);

    await user.type(field(), ',5.');

    expect(field().value).toBe('1,5');
  });

  it('rejects a minus when the minimum is not negative', async () => {
    const user = userEvent.setup();
    render(<Harness kind="integer" initial={5} min={0} />);

    await user.click(field());
    await user.keyboard('{Home}-');

    expect(field().value).toBe('5');
  });

  it('rejects an invalid paste as a whole', async () => {
    const user = userEvent.setup();
    render(<Harness kind="integer" initial={5} />);

    await user.click(field());
    await user.paste('12abc');

    expect(field().value).toBe('5');

    await user.paste('12');

    expect(field().value).toBe('512');
  });

  it('clamps a value out of range on commit', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness kind="integer" initial={5} min={0} max={100} onValueChange={onValueChange} />);

    await user.clear(field());
    await user.type(field(), '150');

    expect(field().getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByRole('tooltip').textContent).toBe(MESSAGES.aboveMax);

    await user.keyboard('{Enter}');

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(100, 'commit');
    expect(field().value).toBe('100');
    expect(field().getAttribute('aria-invalid')).toBeNull();
  });

  it('returns the last valid value for an unfinished number', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    await user.clear(field());
    await user.type(field(), '-');

    expect(screen.getByRole('tooltip').textContent).toBe(MESSAGES.incomplete);

    await user.tab();

    expect(onValueChange).not.toHaveBeenCalled();
    expect(field().value).toBe('1.5');
  });

  it('steps with the arrows and commits the series once', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness initial={1} onValueChange={onValueChange} />);

    await user.click(field());
    await user.keyboard('{ArrowUp}{ArrowUp}{ArrowDown}');

    expect(field().value).toBe('1.1');
    expect(onValueChange.mock.calls).toEqual([
      [1.1, 'preview'],
      [1.2, 'preview'],
      [1.1, 'preview'],
    ]);

    await user.keyboard('{Enter}');

    expect(onValueChange).toHaveBeenLastCalledWith(1.1, 'commit');
    expect(onValueChange).toHaveBeenCalledTimes(4);
  });

  it('takes a finer step with Shift and a coarser one with Alt', async () => {
    const user = userEvent.setup();
    render(<Harness initial={1} />);

    await user.click(field());
    await user.keyboard('{Shift>}{ArrowUp}{/Shift}');

    expect(field().value).toBe('1.01');

    await user.keyboard('{Alt>}{ArrowUp}{/Alt}');

    expect(field().value).toBe('2.01');
  });

  it('cancels arrow steps on Esc', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness initial={1} onValueChange={onValueChange} />);

    await user.click(field());
    await user.keyboard('{ArrowUp}{ArrowUp}{Escape}');

    expect(onValueChange).toHaveBeenLastCalledWith(1, 'cancel');
    expect(field().value).toBe('1');
  });

  it('stops the arrows at the limits', async () => {
    const user = userEvent.setup();
    render(<Harness kind="integer" initial={9} max={10} />);

    await user.click(field());
    await user.keyboard('{ArrowUp}{ArrowUp}');

    expect(field().value).toBe('10');
  });

  it('previews every valid input in live mode', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness kind="integer" initial={1} updateMode="live" onValueChange={onValueChange} />);

    await user.type(field(), '2{Enter}');

    expect(onValueChange.mock.calls).toEqual([
      [12, 'preview'],
      [12, 'commit'],
    ]);
  });

  it('shows a mixed value as a dash and applies any edit', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness mixed onValueChange={onValueChange} />);

    expect(field().value).toBe('');
    expect(field().getAttribute('aria-valuenow')).toBeNull();

    await user.type(field(), '1.5{Enter}');

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(1.5, 'commit');
  });

  it('ignores input and arrows when disabled or read-only', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <NumberField
        aria-label={LABEL}
        value={1}
        invalidMessages={MESSAGES}
        onValueChange={onValueChange}
        readOnly
      />,
    );

    await user.click(field());
    await user.keyboard('5{ArrowUp}{Enter}');

    expect(field().value).toBe('1');

    rerender(
      <NumberField
        aria-label={LABEL}
        value={1}
        invalidMessages={MESSAGES}
        onValueChange={onValueChange}
        disabled
      />,
    );

    expect(field().disabled).toBe(true);
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
