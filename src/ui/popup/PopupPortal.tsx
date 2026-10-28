import { FloatingPortal } from '@floating-ui/react';
import type { ReactNode } from 'react';
import { POPUP_LAYER_ID } from './popupLayerAttributes';

interface PopupPortalProps {
  readonly children: ReactNode;
}

export function PopupPortal({ children }: PopupPortalProps) {
  return <FloatingPortal id={POPUP_LAYER_ID}>{children}</FloatingPortal>;
}
