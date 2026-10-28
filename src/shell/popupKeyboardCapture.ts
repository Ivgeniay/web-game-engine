import { POPUP_BLOCKS_TOOLTIPS_ATTRIBUTE } from '@/ui/popup/popupLayerAttributes';

const KEYBOARD_CAPTURING_POPUP_SELECTOR = `[aria-modal="true"], [${POPUP_BLOCKS_TOOLTIPS_ATTRIBUTE}]`;

export function isKeyboardCapturedByPopup(root: ParentNode): boolean {
  return root.querySelector(KEYBOARD_CAPTURING_POPUP_SELECTOR) !== null;
}
