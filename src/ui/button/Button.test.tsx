import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import type { SubmitEvent } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { Button } from './Button';

const LABEL = 'Apply';
const SUBMIT_LABEL = 'Save';
const SMALL_ICON_VIEW_BOX = '0 0 12 12';
const MEDIUM_ICON_VIEW_BOX = '0 0 16 16';

afterEach(() => {
  cleanup();
});

describe('Button', () => {
  it('renders a native button named by its text', () => {
    render(<Button>{LABEL}</Button>);

    const button = screen.getByRole('button', { name: LABEL });

    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('type')).toBe('button');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>{LABEL}</Button>);

    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is reached with Tab and pressed with Enter and Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>{LABEL}</Button>);

    await user.tab();
    expect(screen.getByRole('button')).toBe(document.activeElement);

    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('ignores the mouse and the keyboard when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        {LABEL}
      </Button>,
    );
    const button = screen.getByRole('button');

    await user.click(button);
    await user.tab();

    expect(button).toHaveProperty('disabled', true);
    expect(document.activeElement).not.toBe(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('shows a decorative icon before the text', () => {
    render(<Button icon={frameworkIcons.settings}>{LABEL}</Button>);

    const button = screen.getByRole('button', { name: LABEL });
    const icon = button.firstElementChild;

    expect(icon?.tagName.toLowerCase()).toBe('svg');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
  });

  it.each([
    { size: 'sm', viewBox: SMALL_ICON_VIEW_BOX },
    { size: 'md', viewBox: MEDIUM_ICON_VIEW_BOX },
    { size: 'lg', viewBox: MEDIUM_ICON_VIEW_BOX },
  ] as const)('draws the icon for the $size size', ({ size, viewBox }) => {
    render(
      <Button icon={frameworkIcons.settings} size={size}>
        {LABEL}
      </Button>,
    );

    const icon = screen.getByRole('button').querySelector('svg');

    expect(icon?.getAttribute('viewBox')).toBe(viewBox);
  });

  it('submits its form only as a submit button', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: SubmitEvent) => {
      event.preventDefault();
    });
    render(
      <form onSubmit={onSubmit}>
        <Button>{LABEL}</Button>
        <Button type="submit">{SUBMIT_LABEL}</Button>
      </form>,
    );

    await user.click(screen.getByRole('button', { name: LABEL }));
    expect(onSubmit).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: SUBMIT_LABEL }));
    expect(onSubmit).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: SUBMIT_LABEL }).getAttribute('type')).toBe('submit');
  });

  it('passes the DOM element to ref and native attributes to the button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} aria-expanded={false}>
        {LABEL}
      </Button>,
    );

    const button = screen.getByRole('button');

    expect(ref.current).toBe(button);
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });
});
