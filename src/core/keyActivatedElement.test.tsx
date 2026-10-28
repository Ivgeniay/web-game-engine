import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { isKeyActivatedElement } from './keyActivatedElement';

const BUTTON = 'Apply';
const CHECKBOX = 'Visible';
const LINK = 'Docs';
const MENU_ITEM = 'Rename';
const FIELD = 'Name';
const AREA = 'Scene view';
const LINK_TARGET = '#docs';

afterEach(() => {
  cleanup();
});

describe('isKeyActivatedElement', () => {
  it('recognizes elements that Space or Enter activates', () => {
    render(
      <div>
        <button type="button">{BUTTON}</button>
        <input type="checkbox" aria-label={CHECKBOX} />
        <a href={LINK_TARGET}>{LINK}</a>
        <div role="menuitem" tabIndex={-1}>
          {MENU_ITEM}
        </div>
      </div>,
    );

    expect(isKeyActivatedElement(screen.getByRole('button', { name: BUTTON }))).toBe(true);
    expect(isKeyActivatedElement(screen.getByRole('checkbox', { name: CHECKBOX }))).toBe(true);
    expect(isKeyActivatedElement(screen.getByRole('link', { name: LINK }))).toBe(true);
    expect(isKeyActivatedElement(screen.getByRole('menuitem', { name: MENU_ITEM }))).toBe(true);
  });

  it('does not count fields and plain areas', () => {
    render(
      <div>
        <input aria-label={FIELD} />
        <section aria-label={AREA} tabIndex={-1} />
      </div>,
    );

    expect(isKeyActivatedElement(screen.getByRole('textbox', { name: FIELD }))).toBe(false);
    expect(isKeyActivatedElement(screen.getByRole('region', { name: AREA }))).toBe(false);
  });
});
