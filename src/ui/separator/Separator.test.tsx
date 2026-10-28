import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Separator } from './Separator';

afterEach(() => {
  cleanup();
});

describe('Separator', () => {
  it('is a horizontal separator by default', () => {
    render(<Separator />);

    const separator = screen.getByRole('separator');

    expect(separator.getAttribute('aria-orientation')).toBe('horizontal');
    expect(separator.hasAttribute('tabindex')).toBe(false);
  });

  it('can be vertical', () => {
    render(<Separator orientation="vertical" />);

    expect(screen.getByRole('separator').getAttribute('aria-orientation')).toBe('vertical');
  });

  it('is a hidden gap in the flexible variant', () => {
    const { container } = render(<Separator variant="flexible" />);

    expect(screen.queryByRole('separator')).toBeNull();
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
  });
});
