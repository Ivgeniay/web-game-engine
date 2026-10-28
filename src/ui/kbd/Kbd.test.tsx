import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Kbd } from './Kbd';

const SHORTCUT = 'Ctrl+Shift+S';

afterEach(() => {
  cleanup();
});

describe('Kbd', () => {
  it('shows the given shortcut in a kbd element that cannot be focused', () => {
    render(<Kbd>{SHORTCUT}</Kbd>);

    const kbd = screen.getByText(SHORTCUT);

    expect(kbd.tagName).toBe('KBD');
    expect(kbd.hasAttribute('tabindex')).toBe(false);
  });
});
