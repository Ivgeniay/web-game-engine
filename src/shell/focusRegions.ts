import { defineCommand } from '@/core/commands/command';
import { messageRef } from '@/core/i18n/translate';
import { combineUnsubscribes } from '@/core/unsubscribe';
import type { Unsubscribe } from '@/core/unsubscribe';
import type { EditorRegistries } from '@/state/registries/editorRegistries';
import { shellMessages } from './shellMessages';

export const FOCUS_REGION_ATTRIBUTE = 'data-focus-region';

export const WORKSPACE_FOCUS_REGION = 'workspace';

export interface FocusRegionProps {
  readonly [FOCUS_REGION_ATTRIBUTE]: string;
}

export type RegionStep = 1 | -1;

export const focusNextRegionCommand = defineCommand({
  id: 'editor.focusNextArea',
  label: messageRef(shellMessages, 'nextArea'),
  shortcut: { keys: 'F6', allowInTextInput: true },
});

export const focusPreviousRegionCommand = defineCommand({
  id: 'editor.focusPreviousArea',
  label: messageRef(shellMessages, 'previousArea'),
  shortcut: { keys: 'Shift+F6', allowInTextInput: true },
});

const TAB_STOP_CANDIDATES = 'button, [href], input, select, textarea, [tabindex]';

export function focusRegionProps(region: string): FocusRegionProps {
  return { [FOCUS_REGION_ATTRIBUTE]: region };
}

function isTabStop(element: HTMLElement): boolean {
  return element.tabIndex >= 0 && !element.matches(':disabled');
}

export function focusFirstTabStop(region: HTMLElement): boolean {
  const tabStop = [...region.querySelectorAll<HTMLElement>(TAB_STOP_CANDIDATES)].find(isTabStop);

  tabStop?.focus();

  return tabStop !== undefined;
}

export function focusAdjacentRegion(
  root: HTMLElement,
  step: RegionStep,
  enterRegion: (region: HTMLElement) => boolean,
): boolean {
  const regions = [...root.querySelectorAll<HTMLElement>(`[${FOCUS_REGION_ATTRIBUTE}]`)];
  const { activeElement } = root.ownerDocument;
  const current = regions.findIndex((region) => region.contains(activeElement));
  const start = current === -1 ? (step === 1 ? -1 : 0) : current;

  for (let offset = 1; offset <= regions.length; offset += 1) {
    const region = regions[(start + step * offset + regions.length * offset) % regions.length];

    if (region !== undefined && region !== regions[current] && enterRegion(region)) {
      return true;
    }
  }

  return false;
}

export function registerFocusRegionCommands(
  { commands, workspace }: EditorRegistries,
  getRoot: () => HTMLElement | null,
): Unsubscribe {
  function enterRegion(region: HTMLElement): boolean {
    const activeWindow = workspace.getActiveWindow();

    if (region.getAttribute(FOCUS_REGION_ATTRIBUTE) !== WORKSPACE_FOCUS_REGION) {
      return focusFirstTabStop(region);
    }

    if (activeWindow === null) {
      return false;
    }

    workspace.requestFocus(activeWindow.id);
    return true;
  }

  function moveFocus(step: RegionStep): void {
    const root = getRoot();

    if (root !== null) {
      focusAdjacentRegion(root, step, enterRegion);
    }
  }

  return combineUnsubscribes(
    commands.handle(focusNextRegionCommand, {
      run: () => {
        moveFocus(1);
      },
    }),
    commands.handle(focusPreviousRegionCommand, {
      run: () => {
        moveFocus(-1);
      },
    }),
  );
}
