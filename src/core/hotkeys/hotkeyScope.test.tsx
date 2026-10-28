import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { hotkeyScopeProps, hotkeyScopesOf } from './hotkeyScope';

const INNER = 'Inner';
const OUTSIDE = 'Outside';

afterEach(() => {
  cleanup();
});

describe('hotkeyScopesOf', () => {
  it('lists the scopes around an element from the nearest to the farthest', () => {
    render(
      <div {...hotkeyScopeProps('scene')}>
        <div>
          <div {...hotkeyScopeProps('gizmos')}>
            <button type="button">{INNER}</button>
          </div>
        </div>
      </div>,
    );

    expect(hotkeyScopesOf(screen.getByRole('button', { name: INNER }))).toEqual([
      'gizmos',
      'scene',
    ]);
  });

  it('includes the scope of the element itself', () => {
    render(<section {...hotkeyScopeProps('hierarchy')} aria-label={INNER} />);

    expect(hotkeyScopesOf(screen.getByRole('region', { name: INNER }))).toEqual(['hierarchy']);
  });

  it('returns no scopes outside of any scope', () => {
    render(<button type="button">{OUTSIDE}</button>);

    expect(hotkeyScopesOf(screen.getByRole('button', { name: OUTSIDE }))).toEqual([]);
  });
});
