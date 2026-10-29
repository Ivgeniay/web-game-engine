import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { hotkeyScopeProps } from '@/core/hotkeys/hotkeyScope';
import { useEditorRegistries } from '@/state/registries/registriesContext';
import { isInsidePopupLayer } from '@/ui/popup/popupLayerAttributes';
import styles from './WindowFrame.module.css';

interface WindowFrameProps {
  readonly windowId: string;
  readonly windowType: string;
  readonly onActivate: () => void;
  readonly children: ReactNode;
}

export function WindowFrame({ windowId, windowType, onActivate, children }: WindowFrameProps) {
  const { workspace } = useEditorRegistries();
  const frameRef = useRef<HTMLDivElement>(null);
  const focusingOnRequest = useRef(false);

  useEffect(() => {
    function focusWhenRequested(): void {
      const frame = frameRef.current;

      if (frame === null || !frame.isConnected || !workspace.takeFocusRequest(windowId)) {
        return;
      }

      const active = frame.ownerDocument.activeElement;

      if (frame.contains(active) || isInsidePopupLayer(active)) {
        return;
      }

      focusingOnRequest.current = true;
      frame.focus({ preventScroll: true });
      focusingOnRequest.current = false;
    }

    focusWhenRequested();

    return workspace.subscribe(focusWhenRequested);
  }, [workspace, windowId]);

  function handleFocus(): void {
    if (!focusingOnRequest.current) {
      onActivate();
    }
  }

  return (
    <div
      ref={frameRef}
      className={styles.root}
      tabIndex={-1}
      onFocus={handleFocus}
      {...hotkeyScopeProps(windowType)}
    >
      {children}
    </div>
  );
}
