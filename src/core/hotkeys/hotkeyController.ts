import type { CommandRegistry, HandledCommand } from '@/core/commands/commandRegistry';
import { isTextInput } from '@/core/textInput';
import { combineUnsubscribes } from '@/core/unsubscribe';
import type { Unsubscribe } from '@/core/unsubscribe';
import { findHotkeyBindings } from './hotkeyDispatcher';
import type { HotkeyContext } from './hotkeyDispatcher';
import { hotkeyScopesOf } from './hotkeyScope';
import { createKeymap } from './keymap';
import type { Keymap } from './keymap';
import type { Platform } from './platform';

export interface HotkeyControllerOptions {
  readonly commands: CommandRegistry;
  readonly target: EventTarget;
  readonly platform: Platform;
  readonly areGlobalHotkeysBlocked: () => boolean;
}

const ALT_GRAPH_MODIFIER = 'AltGraph';

function contextOf(target: Element, globalBlocked: boolean): HotkeyContext {
  return {
    scopes: hotkeyScopesOf(target),
    inTextInput: isTextInput(target),
    globalBlocked,
  };
}

function shouldIgnore(event: KeyboardEvent): boolean {
  return event.defaultPrevented || event.isComposing || event.getModifierState(ALT_GRAPH_MODIFIER);
}

export function startHotkeyController({
  commands,
  target,
  platform,
  areGlobalHotkeysBlocked,
}: HotkeyControllerOptions): Unsubscribe {
  let handledCommands: readonly HandledCommand[] | null = null;
  let keymap: Keymap = new Map();

  function updateKeymap(): void {
    const current = commands.getHandledCommands();

    if (current === handledCommands) {
      return;
    }

    handledCommands = current;
    keymap = createKeymap(current.map(({ command }) => command));
  }

  function handleKeyDown(event: Event): void {
    if (
      !(event instanceof KeyboardEvent) ||
      !(event.target instanceof Element) ||
      shouldIgnore(event)
    ) {
      return;
    }

    const bindings = findHotkeyBindings(
      keymap,
      event,
      contextOf(event.target, areGlobalHotkeysBlocked()),
      platform,
    );

    if (bindings.length === 0) {
      return;
    }

    event.preventDefault();
    bindings.some(({ command }) =>
      commands.execute(command, { source: 'hotkey', target: undefined }),
    );
  }

  updateKeymap();
  target.addEventListener('keydown', handleKeyDown);

  return combineUnsubscribes(commands.subscribe(updateKeymap), () => {
    target.removeEventListener('keydown', handleKeyDown);
  });
}
