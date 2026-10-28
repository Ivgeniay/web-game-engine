import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import type { Language } from '@/core/i18n/languages';
import { createTestEditor } from '@/shell/testEditor';
import { StoresProvider } from '@/state/stores/StoresProvider';
import { NumberField } from '@/ui/numberField/NumberField';
import { useNumberFieldMessages } from './useNumberFieldMessages';

const LABEL = 'Intensity';
const MIN = 0;
const MAX = 10;

function IntensityField() {
  const messages = useNumberFieldMessages({ min: MIN, max: MAX });

  return (
    <NumberField aria-label={LABEL} value={1.5} min={MIN} max={MAX} invalidMessages={messages} />
  );
}

function renderIn(language: Language) {
  const { stores } = createTestEditor('other', language);

  return render(
    <StoresProvider stores={stores}>
      <IntensityField />
    </StoresProvider>,
  );
}

function field(): HTMLElement {
  return screen.getByRole('spinbutton', { name: LABEL });
}

afterEach(() => {
  cleanup();
});

describe('useNumberFieldMessages', () => {
  it.each([
    { language: 'en', text: '1.5', message: 'The maximum is 10' },
    { language: 'ru', text: '1,5', message: 'Максимум — 10' },
  ] as const)('formats and explains numbers in $language', async ({ language, text, message }) => {
    const user = userEvent.setup();
    renderIn(language);

    expect(field()).toHaveProperty('value', text);

    await user.clear(field());
    await user.type(field(), '11');

    expect(screen.getByRole('tooltip').textContent).toBe(message);
  });
});
