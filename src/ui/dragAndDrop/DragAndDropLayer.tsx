import { useState, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { POPUP_BLOCKS_TOOLTIPS_PROPS } from '@/ui/popup/popupLayerAttributes';
import { PopupPortal } from '@/ui/popup/PopupPortal';
import { DROP_TARGET_ATTRIBUTE, DragAndDropContext } from './dragAndDropContext';
import { createDragAndDropManager } from './dragAndDropManager';
import type { DragAndDropManager } from './dragAndDropManager';
import type { DragPoint, DragSession } from './dragData';
import styles from './DragAndDropLayer.module.css';

interface DragAndDropLayerProps {
  readonly children: ReactNode;
}

interface DragPreviewProps {
  readonly manager: DragAndDropManager;
}

function findDropTarget({ clientX, clientY }: DragPoint): string | null {
  const element = document.elementFromPoint(clientX, clientY);

  return (
    element?.closest(`[${DROP_TARGET_ATTRIBUTE}]`)?.getAttribute(DROP_TARGET_ATTRIBUTE) ?? null
  );
}

function noSessionOnServer(): DragSession | null {
  return null;
}

function DragPreview({ manager }: DragPreviewProps) {
  const session = useSyncExternalStore(manager.subscribe, manager.getSession, noSessionOnServer);

  if (session === null) {
    return null;
  }

  const { clientX, clientY } = session.point;

  return (
    <PopupPortal>
      <div
        className={styles.preview}
        data-allowed={session.allowed || undefined}
        aria-hidden
        {...POPUP_BLOCKS_TOOLTIPS_PROPS}
        style={{ transform: `translate(${String(clientX)}px, ${String(clientY)}px)` }}
      >
        {session.data.label}
      </div>
    </PopupPortal>
  );
}

export function DragAndDropLayer({ children }: DragAndDropLayerProps) {
  const [manager] = useState(() => createDragAndDropManager(findDropTarget));

  return (
    <DragAndDropContext value={manager}>
      {children}
      <DragPreview manager={manager} />
    </DragAndDropContext>
  );
}
