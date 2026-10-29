import { act, cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ThumbnailLoader } from '@/contracts/thumbnail';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { Thumbnail } from './Thumbnail';

const ROCK_URL = 'data:image/png;base64,rock';
const SKY_URL = 'data:image/png;base64,sky';

interface PendingLoad {
  readonly id: string;
  readonly signal: AbortSignal;
  readonly resolve: (url: string) => void;
  readonly reject: (error: Error) => void;
}

function createLoader() {
  const pending: PendingLoad[] = [];
  const load: ThumbnailLoader = (id, signal) =>
    new Promise((resolve, reject) => {
      pending.push({ id, signal, resolve, reject });
    });

  return { load, pending };
}

function image(container: HTMLElement): HTMLImageElement | null {
  return container.querySelector('img');
}

afterEach(cleanup);

describe('Thumbnail', () => {
  it('shows the placeholder icon until the preview is loaded', async () => {
    const { load, pending } = createLoader();
    const { container } = render(
      <Thumbnail id="rock" load={load} placeholder={frameworkIcons.file} />,
    );

    expect(image(container)).toBeNull();
    expect(container.querySelector('svg')).not.toBeNull();

    await act(async () => {
      pending[0]?.resolve(ROCK_URL);
      await Promise.resolve();
    });

    expect(image(container)?.getAttribute('src')).toBe(ROCK_URL);
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
  });

  it('cancels the load when the item changes or the thumbnail goes away', async () => {
    const { load, pending } = createLoader();
    const { container, rerender, unmount } = render(
      <Thumbnail id="rock" load={load} placeholder={frameworkIcons.file} />,
    );

    rerender(<Thumbnail id="sky" load={load} placeholder={frameworkIcons.file} />);

    expect(pending[0]?.signal.aborted).toBe(true);

    await act(async () => {
      pending[0]?.resolve(ROCK_URL);
      pending[1]?.resolve(SKY_URL);
      await Promise.resolve();
    });

    expect(image(container)?.getAttribute('src')).toBe(SKY_URL);

    unmount();

    expect(pending[1]?.signal.aborted).toBe(true);
  });

  it('keeps the placeholder when the load fails', async () => {
    const { load, pending } = createLoader();
    const { container } = render(
      <Thumbnail id="rock" load={load} placeholder={frameworkIcons.file} />,
    );

    await act(async () => {
      pending[0]?.reject(new Error('No preview'));
      await Promise.resolve();
    });

    expect(image(container)).toBeNull();
  });

  it('shows an image from an address without loading', () => {
    const load = vi.fn<ThumbnailLoader>();
    const { container } = render(
      <Thumbnail id="rock" src={ROCK_URL} load={load} placeholder={frameworkIcons.file} />,
    );

    expect(image(container)?.getAttribute('src')).toBe(ROCK_URL);
    expect(load).not.toHaveBeenCalled();
  });
});
