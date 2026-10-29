import { cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LANGUAGES } from '@/core/i18n/languages';
import { createTestEditor } from '@/shell/testEditor';
import { PlatformProvider } from '@/state/platform/PlatformProvider';
import { StoresProvider } from '@/state/stores/StoresProvider';
import { DragAndDropLayer } from '@/ui/dragAndDrop/DragAndDropLayer';
import { PopupLayer } from '@/ui/popup/PopupLayer';
import { installVirtualListEnvironment } from '@/ui/virtualList/virtualListTestEnvironment';
import type { VirtualListTestEnvironment } from '@/ui/virtualList/virtualListTestEnvironment';
import { SHOWCASE_PAGES } from './pages';

const PAGE_CASES = SHOWCASE_PAGES.flatMap((page) =>
  LANGUAGES.map((language) => ({ id: page.id, language, Page: page.component })),
);

let environment: VirtualListTestEnvironment;

beforeEach(() => {
  environment = installVirtualListEnvironment();
});

afterEach(() => {
  cleanup();
  environment.restore();
});

describe('showcase pages', () => {
  it.each(PAGE_CASES)('renders $id in $language', ({ language, Page }) => {
    const consoleError = vi.spyOn(console, 'error');
    const { stores, platform } = createTestEditor('other', language);

    const { container } = render(
      <StoresProvider stores={stores}>
        <PlatformProvider platform={platform}>
          <PopupLayer>
            <DragAndDropLayer>
              <Page />
            </DragAndDropLayer>
          </PopupLayer>
        </PlatformProvider>
      </StoresProvider>,
    );

    const headings = container.querySelectorAll('h2');

    expect(headings.length).toBeGreaterThan(0);

    for (const heading of headings) {
      expect(heading.textContent).not.toBe('');
    }

    expect(consoleError).not.toHaveBeenCalled();
  });
});
