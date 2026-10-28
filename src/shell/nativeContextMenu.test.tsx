import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { Unsubscribe } from '@/core/unsubscribe';
import { startNativeContextMenuSuppression } from './nativeContextMenu';

const AREA = 'Area';
const FIELD = 'Name';

let stop: Unsubscribe | null = null;

function setUp(): void {
  stop = startNativeContextMenuSuppression(document);
  render(
    <section aria-label={AREA}>
      <input aria-label={FIELD} />
      <textarea aria-label={FIELD} />
    </section>,
  );
}

afterEach(() => {
  stop?.();
  stop = null;
  cleanup();
});

describe('startNativeContextMenuSuppression', () => {
  it('suppresses the native menu inside the editor', () => {
    setUp();

    expect(fireEvent.contextMenu(screen.getByRole('region', { name: AREA }))).toBe(false);
  });

  it('keeps the native menu of text fields', () => {
    setUp();

    for (const field of screen.getAllByRole('textbox', { name: FIELD })) {
      expect(fireEvent.contextMenu(field)).toBe(true);
    }
  });

  it('stops suppressing when stopped', () => {
    setUp();
    stop?.();

    expect(fireEvent.contextMenu(screen.getByRole('region', { name: AREA }))).toBe(true);
  });
});
