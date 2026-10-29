import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { createTestEditor } from '@/shell/testEditor';
import { StoresProvider } from '@/state/stores/StoresProvider';
import { defineDocMessages } from './docMessages';
import { useDocMessages } from './useDocMessages';

const messages = defineDocMessages({
  en: {
    text: 'Pass **ready text** from `useMessages`, see [Localization](foundations/localization).',
  },
  ru: {
    text: 'Передайте **готовый текст** из `useMessages`, см. [Локализация](foundations/localization).',
  },
});

const PARAGRAPH_ID = 'paragraph';

function Paragraph() {
  const doc = useDocMessages(messages);

  return <p data-testid={PARAGRAPH_ID}>{doc('text')}</p>;
}

function renderParagraph() {
  const { stores } = createTestEditor('other', 'en');

  render(
    <StoresProvider stores={stores}>
      <Paragraph />
    </StoresProvider>,
  );

  return stores;
}

afterEach(() => {
  cleanup();
});

describe('useDocMessages', () => {
  it('renders code, strong text and page links of the current language', () => {
    renderParagraph();

    expect(screen.getByTestId(PARAGRAPH_ID).textContent).toBe(
      'Pass ready text from useMessages, see Localization.',
    );
    expect(screen.getByText('useMessages').tagName).toBe('CODE');
    expect(screen.getByText('ready text').tagName).toBe('STRONG');
    expect(screen.getByRole('link', { name: 'Localization' }).getAttribute('href')).toBe(
      '#/foundations/localization',
    );
  });

  it('follows a language change without remounting', () => {
    const stores = renderParagraph();

    act(() => {
      stores.language.getState().setLanguage('ru');
    });

    expect(screen.getByTestId(PARAGRAPH_ID).textContent).toBe(
      'Передайте готовый текст из useMessages, см. Локализация.',
    );
    expect(screen.getByRole('link', { name: 'Локализация' })).toBeDefined();
  });
});
