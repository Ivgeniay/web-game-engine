import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { POPUP_BLOCKS_TOOLTIPS_PROPS } from '@/ui/popup/popupLayerAttributes';
import { isKeyboardCapturedByPopup } from './popupKeyboardCapture';

afterEach(() => {
  cleanup();
});

describe('isKeyboardCapturedByPopup', () => {
  it('is false without open popups', () => {
    render(<div />);

    expect(isKeyboardCapturedByPopup(document)).toBe(false);
  });

  it.each([
    ['a dialog', { 'aria-modal': 'true' }],
    ['a menu or a list', POPUP_BLOCKS_TOOLTIPS_PROPS],
  ])('is true while %s is open', (_case, popupProps) => {
    render(<div {...popupProps} />);

    expect(isKeyboardCapturedByPopup(document)).toBe(true);
  });
});
