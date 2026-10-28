import { useCallback, useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { isKeyboardCapturedByPopup } from './popupKeyboardCapture';

export interface MenuBarActivationOptions {
  readonly barRef: RefObject<HTMLElement | null>;
  readonly altKeyActivates: boolean;
}

export interface MenuBarActivation {
  readonly leaveMenuBar: () => void;
}

const ALT_KEY = 'Alt';
const ACTIVATION_KEY = 'F10';
const ALT_GRAPH_MODIFIER = 'AltGraph';
const TAB_STOP_SELECTOR = '[tabindex="0"]';

function hasOtherModifiers(event: KeyboardEvent): boolean {
  return event.ctrlKey || event.metaKey || event.shiftKey || event.altKey;
}

export function useMenuBarActivation({
  barRef,
  altKeyActivates,
}: MenuBarActivationOptions): MenuBarActivation {
  const previousFocus = useRef<HTMLElement | null>(null);

  const leaveMenuBar = useCallback(() => {
    const bar = barRef.current;
    const previous = previousFocus.current;
    previousFocus.current = null;

    if (previous !== null && previous.isConnected) {
      previous.focus();
      return;
    }

    const active = bar?.ownerDocument.activeElement;

    if (active instanceof HTMLElement && bar?.contains(active) === true) {
      active.blur();
    }
  }, [barRef]);

  useEffect(() => {
    const bar = barRef.current;

    if (bar === null) {
      return undefined;
    }

    const document = bar.ownerDocument;
    let altTapPending = false;

    function toggleMenuBarFocus(): void {
      const active = document.activeElement;

      if (bar === null) {
        return;
      }

      if (active !== null && bar.contains(active)) {
        leaveMenuBar();
        return;
      }

      const tabStop = bar.querySelector<HTMLElement>(TAB_STOP_SELECTOR);

      if (tabStop === null) {
        return;
      }

      previousFocus.current = active instanceof HTMLElement ? active : null;
      tabStop.focus();
    }

    function handleKeyDown(event: KeyboardEvent): void {
      altTapPending =
        event.key === ALT_KEY &&
        !event.repeat &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey &&
        !event.getModifierState(ALT_GRAPH_MODIFIER);

      if (
        event.key !== ACTIVATION_KEY ||
        event.defaultPrevented ||
        hasOtherModifiers(event) ||
        isKeyboardCapturedByPopup(document)
      ) {
        return;
      }

      event.preventDefault();
      toggleMenuBarFocus();
    }

    function handleKeyUp(event: KeyboardEvent): void {
      const isAltTap = altTapPending && event.key === ALT_KEY;
      altTapPending = false;

      if (!isAltTap || !altKeyActivates || isKeyboardCapturedByPopup(document)) {
        return;
      }

      event.preventDefault();
      toggleMenuBarFocus();
    }

    function cancelAltTap(): void {
      altTapPending = false;
    }

    function rememberFocusBeforeBar(event: FocusEvent): void {
      const { relatedTarget } = event;

      if (relatedTarget instanceof Node && bar?.contains(relatedTarget) === true) {
        return;
      }

      previousFocus.current = relatedTarget instanceof HTMLElement ? relatedTarget : null;
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('pointerdown', cancelAltTap);
    bar.addEventListener('focusin', rememberFocusBeforeBar);

    return () => {
      bar.removeEventListener('focusin', rememberFocusBeforeBar);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('pointerdown', cancelAltTap);
    };
  }, [barRef, altKeyActivates, leaveMenuBar]);

  return { leaveMenuBar };
}
