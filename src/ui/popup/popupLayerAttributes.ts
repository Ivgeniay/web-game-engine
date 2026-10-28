export const POPUP_LAYER_ID = 'popup-layer';

export const POPUP_BLOCKS_TOOLTIPS_ATTRIBUTE = 'data-popup-blocks-tooltips';

export function isTooltipBlocked(root: ParentNode): boolean {
  return root.querySelector(`[${POPUP_BLOCKS_TOOLTIPS_ATTRIBUTE}]`) !== null;
}
