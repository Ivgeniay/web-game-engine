import { act, cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { ToggleButton } from './ToggleButton';

const TEXT = 'Gizmos';
const ICON_LABEL = 'Show grid';
const SMALL_ICON_VIEW_BOX = '0 0 12 12';

afterEach(() => {
  cleanup();
});

describe('ToggleButton', () => {
  it.each([true, false])('reports aria-pressed=%s', (pressed) => {
    render(
      <ToggleButton pressed={pressed} onPressedChange={vi.fn()}>
        {TEXT}
      </ToggleButton>,
    );

    const button = screen.getByRole('button', { name: TEXT, pressed });

    expect(button.getAttribute('type')).toBe('button');
  });

  it.each([true, false])('asks to switch from pressed=%s on click', async (pressed) => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <ToggleButton pressed={pressed} onPressedChange={onPressedChange}>
        {TEXT}
      </ToggleButton>,
    );

    await user.click(screen.getByRole('button'));

    expect(onPressedChange).toHaveBeenCalledExactlyOnceWith(!pressed);
  });

  it('switches with Enter and Space after Tab', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <ToggleButton pressed={false} onPressedChange={onPressedChange}>
        {TEXT}
      </ToggleButton>,
    );

    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button'));
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onPressedChange).toHaveBeenCalledTimes(2);
  });

  it('ignores the mouse and the keyboard when disabled', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <ToggleButton pressed onPressedChange={onPressedChange} disabled>
        {TEXT}
      </ToggleButton>,
    );
    const button = screen.getByRole('button');

    await user.click(button);
    await user.tab();

    expect(button).toHaveProperty('disabled', true);
    expect(document.activeElement).not.toBe(button);
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it('stays focusable but keeps its state when disabled with focusableWhenDisabled', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <ToggleButton pressed onPressedChange={onPressedChange} disabled focusableWhenDisabled>
        {TEXT}
      </ToggleButton>,
    );
    const button = screen.getByRole('button', { name: TEXT });

    await user.tab();
    await user.keyboard('{Enter} ');
    await user.click(button);

    expect(document.activeElement).toBe(button);
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it('names an icon-only toggle by its label', () => {
    render(
      <ToggleButton
        pressed={false}
        onPressedChange={vi.fn()}
        icon={frameworkIcons.settings}
        label={ICON_LABEL}
        size="sm"
      />,
    );

    const button = screen.getByRole('button', { name: ICON_LABEL });
    act(() => {
      button.focus();
    });

    expect(button.hasAttribute('title')).toBe(false);
    expect(screen.getByRole('tooltip').textContent).toBe(ICON_LABEL);
    expect(button.textContent).toBe('');
    expect(button.querySelector('svg')?.getAttribute('viewBox')).toBe(SMALL_ICON_VIEW_BOX);
  });

  it('shows an icon before the text without a tooltip', () => {
    render(
      <ToggleButton pressed={false} onPressedChange={vi.fn()} icon={frameworkIcons.settings}>
        {TEXT}
      </ToggleButton>,
    );

    const button = screen.getByRole('button', { name: TEXT });

    expect(button.firstElementChild?.tagName.toLowerCase()).toBe('svg');
    act(() => {
      button.focus();
    });

    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('passes the DOM element to ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <ToggleButton ref={ref} pressed={false} onPressedChange={vi.fn()}>
        {TEXT}
      </ToggleButton>,
    );

    expect(ref.current).toBe(screen.getByRole('button'));
  });
});
