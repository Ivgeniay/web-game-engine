import { classNames } from '@/ui/classNames';
import { Kbd } from '@/ui/kbd/Kbd';
import { PopupPortal } from '@/ui/popup/PopupPortal';
import popupSurface from '@/ui/popup/popupSurface.module.css';
import styles from './TooltipBubble.module.css';
import type { TooltipBubbleProps } from './useTooltip';

export function TooltipBubble({
  content,
  shortcut,
  setFloating,
  floatingStyles,
  floatingProps,
  referenceHidden,
}: TooltipBubbleProps) {
  return (
    <PopupPortal>
      <div
        {...floatingProps}
        ref={setFloating}
        className={classNames(popupSurface.surface, styles.root)}
        style={floatingStyles}
        role="tooltip"
        data-reference-hidden={referenceHidden ? '' : undefined}
      >
        <span>{content}</span>
        {shortcut !== undefined && <Kbd>{shortcut}</Kbd>}
      </div>
    </PopupPortal>
  );
}
