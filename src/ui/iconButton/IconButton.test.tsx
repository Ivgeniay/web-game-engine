import { act, cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { IconButton } from './IconButton';

const LABEL = 'Settings';
const SHORTCUT = 'Ctrl+,';
const SMALL_ICON_VIEW_BOX = '0 0 12 12';
const MEDIUM_ICON_VIEW_BOX = '0 0 16 16';

afterEach(() => {
  cleanup();
});

describe('IconButton', () => {
  it('is named by its label and shows it in a tooltip', () => {
    render(<IconButton label={LABEL} icon={frameworkIcons.settings} />);
    const button = screen.getByRole('button', { name: LABEL });

    act(() => {
      button.focus();
    });

    expect(button.getAttribute('type')).toBe('button');
    expect(button.getAttribute('aria-label')).toBe(LABEL);
    expect(button.hasAttribute('title')).toBe(false);
    expect(button.textContent).toBe('');
    expect(screen.getByRole('tooltip').textContent).toBe(LABEL);
    expect(button.hasAttribute('aria-describedby')).toBe(false);
  });

  it('shows the shortcut in the tooltip and describes the button with it', () => {
    render(<IconButton label={LABEL} icon={frameworkIcons.settings} shortcut={SHORTCUT} />);
    const button = screen.getByRole('button', { name: LABEL });

    act(() => {
      button.focus();
    });
    const tooltip = screen.getByRole('tooltip');

    expect(tooltip.querySelector('kbd')?.textContent).toBe(SHORTCUT);
    expect(button.getAttribute('aria-describedby')).toBe(tooltip.id);
  });

  it('shows only a decorative icon', () => {
    render(<IconButton label={LABEL} icon={frameworkIcons.settings} />);

    const icon = screen.getByRole('button').querySelector('svg');

    expect(icon?.getAttribute('aria-hidden')).toBe('true');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<IconButton label={LABEL} icon={frameworkIcons.settings} onClick={onClick} />);

    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is reached with Tab and pressed with Enter and Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<IconButton label={LABEL} icon={frameworkIcons.settings} onClick={onClick} />);

    await user.tab();
    expect(screen.getByRole('button')).toBe(document.activeElement);

    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('ignores the mouse and the keyboard when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<IconButton label={LABEL} icon={frameworkIcons.settings} disabled onClick={onClick} />);
    const button = screen.getByRole('button');

    await user.click(button);
    await user.tab();

    expect(button).toHaveProperty('disabled', true);
    expect(document.activeElement).not.toBe(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it.each([
    { size: 'sm', viewBox: SMALL_ICON_VIEW_BOX },
    { size: 'md', viewBox: MEDIUM_ICON_VIEW_BOX },
    { size: 'lg', viewBox: MEDIUM_ICON_VIEW_BOX },
  ] as const)('draws the icon for the $size size', ({ size, viewBox }) => {
    render(<IconButton label={LABEL} icon={frameworkIcons.settings} size={size} />);

    const icon = screen.getByRole('button').querySelector('svg');

    expect(icon?.getAttribute('viewBox')).toBe(viewBox);
  });

  it('passes the DOM element to ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<IconButton ref={ref} label={LABEL} icon={frameworkIcons.settings} />);

    expect(ref.current).toBe(screen.getByRole('button'));
  });
});
