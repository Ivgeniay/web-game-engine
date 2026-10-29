import { vi } from 'vitest';
import { ROW_HEIGHT_TOKEN } from './useVirtualRows';

export const TEST_ROW_HEIGHT = 20;
export const TEST_VISIBLE_ROWS = 10;

const LIST_ROLES: ReadonlySet<string> = new Set(['listbox', 'tree']);

export interface VirtualListTestEnvironment {
  readonly getScrollTop: () => number;
  readonly setScrollTop: (scrollTop: number) => void;
  readonly restore: () => void;
}

class FakeResizeObserver {
  observe(): void {
    return undefined;
  }

  unobserve(): void {
    return undefined;
  }

  disconnect(): void {
    return undefined;
  }
}

export function installVirtualListEnvironment(): VirtualListTestEnvironment {
  let scrollTop = 0;

  vi.stubGlobal('ResizeObserver', FakeResizeObserver);
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(function (
    this: HTMLElement,
  ) {
    return LIST_ROLES.has(this.getAttribute('role') ?? '')
      ? TEST_ROW_HEIGHT * TEST_VISIBLE_ROWS
      : 0;
  });
  vi.spyOn(Element.prototype, 'scrollTop', 'get').mockImplementation(() => scrollTop);
  Object.defineProperty(Element.prototype, 'scrollTo', {
    configurable: true,
    value: ({ top }: ScrollToOptions) => {
      scrollTop = Math.max(0, top ?? scrollTop);
    },
  });
  document.documentElement.style.setProperty(ROW_HEIGHT_TOKEN, `${String(TEST_ROW_HEIGHT)}px`);

  return {
    getScrollTop: () => scrollTop,
    setScrollTop: (value) => {
      scrollTop = value;
    },
    restore: () => {
      vi.restoreAllMocks();
      vi.unstubAllGlobals();
      Reflect.deleteProperty(Element.prototype, 'scrollTo');
      document.documentElement.style.removeProperty(ROW_HEIGHT_TOKEN);
    },
  };
}
