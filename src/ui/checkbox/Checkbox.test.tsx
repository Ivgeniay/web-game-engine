import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';
import type { CheckboxChecked } from './Checkbox';

const LABEL = 'Cast shadows';
const HIDDEN_LABEL = 'Enabled';
const CAPTION_ID = 'caption';

function checkbox(): HTMLInputElement {
  const element = screen.getByRole('checkbox');

  if (!(element instanceof HTMLInputElement)) {
    throw new Error('Checkbox did not render an input element');
  }

  return element;
}

afterEach(() => {
  cleanup();
});

describe('Checkbox', () => {
  it.each([
    { checked: true, nativeChecked: true, indeterminate: false },
    { checked: false, nativeChecked: false, indeterminate: false },
    { checked: 'mixed', nativeChecked: false, indeterminate: true },
  ] as const)(
    'shows checked=$checked as a native checkbox',
    ({ checked, nativeChecked, indeterminate }) => {
      render(<Checkbox checked={checked} onCheckedChange={vi.fn()} label={LABEL} />);

      expect(screen.getByRole('checkbox', { name: LABEL })).toBe(checkbox());
      expect(checkbox().type).toBe('checkbox');
      expect(checkbox().checked).toBe(nativeChecked);
      expect(checkbox().indeterminate).toBe(indeterminate);
    },
  );

  it.each([
    { checked: false, next: true },
    { checked: true, next: false },
    { checked: 'mixed', next: true },
  ] as const)('asks to switch from $checked to $next on click', async ({ checked, next }) => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox checked={checked} onCheckedChange={onCheckedChange} label={LABEL} />);

    await user.click(checkbox());

    expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(next);
  });

  it('switches when its label is clicked', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox checked={false} onCheckedChange={onCheckedChange} label={LABEL} />);

    await user.click(screen.getByText(LABEL));

    expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(true);
  });

  it('is reached with Tab and switched with Space but not Enter', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox checked={false} onCheckedChange={onCheckedChange} label={LABEL} />);

    await user.tab();
    expect(document.activeElement).toBe(checkbox());
    await user.keyboard('{Enter}');
    expect(onCheckedChange).not.toHaveBeenCalled();
    await user.keyboard(' ');

    expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(true);
  });

  it('stays mixed when the owner keeps the mixed value after a click', async () => {
    const user = userEvent.setup();
    render(<Checkbox checked="mixed" onCheckedChange={vi.fn()} label={LABEL} />);

    await user.click(checkbox());

    expect(checkbox().indeterminate).toBe(true);
    expect(checkbox().checked).toBe(false);
  });

  it('becomes mixed and leaves the mixed state when the value changes', () => {
    function renderWith(checked: CheckboxChecked) {
      return <Checkbox checked={checked} onCheckedChange={vi.fn()} label={LABEL} />;
    }
    const { rerender } = render(renderWith(false));

    rerender(renderWith('mixed'));
    expect(checkbox().indeterminate).toBe(true);
    rerender(renderWith(true));
    expect(checkbox().indeterminate).toBe(false);
    expect(checkbox().checked).toBe(true);
  });

  it('ignores the mouse and the keyboard when disabled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox checked={false} onCheckedChange={onCheckedChange} label={LABEL} disabled />);

    await user.click(checkbox());
    await user.click(screen.getByText(LABEL));
    await user.tab();

    expect(checkbox().disabled).toBe(true);
    expect(document.activeElement).not.toBe(checkbox());
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('can be named without a visible label', () => {
    render(
      <>
        <span id={CAPTION_ID}>{LABEL}</span>
        <Checkbox checked onCheckedChange={vi.fn()} aria-label={HIDDEN_LABEL} />
        <Checkbox checked onCheckedChange={vi.fn()} aria-labelledby={CAPTION_ID} />
      </>,
    );

    expect(screen.getByRole('checkbox', { name: HIDDEN_LABEL })).toBeDefined();
    expect(screen.getByRole('checkbox', { name: LABEL })).toBeDefined();
  });

  it('passes the input element to ref and native attributes to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} checked onCheckedChange={vi.fn()} label={LABEL} name="shadows" />);

    expect(ref.current).toBe(checkbox());
    expect(checkbox().name).toBe('shadows');
  });
});
