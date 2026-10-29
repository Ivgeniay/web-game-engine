import { reportDevelopmentError } from '@/shared/developmentError';
import { createRegistry } from '@/core/registry/registry';
import type { Unsubscribe } from '@/core/unsubscribe';
import type {
  CommandDefinition,
  CommandDefinitionBase,
  CommandHandler,
  CommandInvocation,
} from './command';

export interface HandledCommand {
  readonly command: CommandDefinitionBase;
  readonly handler: CommandHandler<unknown>;
}

export interface CommandState {
  readonly handled: boolean;
  readonly enabled: boolean;
  readonly checked: boolean | undefined;
}

export interface CommandRegistry {
  readonly handle: <TTarget>(
    command: CommandDefinition<TTarget>,
    handler: CommandHandler<TTarget>,
  ) => Unsubscribe;
  readonly isHandled: (command: CommandDefinitionBase) => boolean;
  readonly getState: <TTarget>(
    command: CommandDefinition<TTarget>,
    invocation: CommandInvocation<TTarget>,
  ) => CommandState;
  readonly execute: <TTarget>(
    command: CommandDefinition<TTarget>,
    invocation: CommandInvocation<TTarget>,
  ) => boolean;
  readonly getHandledCommands: () => readonly HandledCommand[];
  readonly refresh: () => void;
  readonly getVersion: () => number;
  readonly subscribe: (listener: () => void) => Unsubscribe;
}

const UNHANDLED_STATE: CommandState = { handled: false, enabled: false, checked: undefined };

function reportCommandFailure(commandId: string, error: unknown): void {
  console.error(`Command "${commandId}" failed.`, error);
}

export function createCommandRegistry(): CommandRegistry {
  const handledCommands = createRegistry<HandledCommand>({
    kind: 'command',
    getId: (entry) => entry.command.id,
  });
  const listeners = new Set<() => void>();
  let version = 0;

  function changed(): void {
    version += 1;

    for (const listener of [...listeners]) {
      listener();
    }
  }

  handledCommands.subscribe(changed);

  function handlerOf(command: CommandDefinitionBase): CommandHandler<unknown> | undefined {
    const entry = handledCommands.get(command.id);

    if (entry === undefined) {
      return undefined;
    }

    if (entry.command !== command) {
      reportDevelopmentError(
        `Command id "${command.id}" belongs to another definition. Each command needs a unique id.`,
      );
      return undefined;
    }

    return entry.handler;
  }

  function isEnabled(
    handler: CommandHandler<unknown>,
    invocation: CommandInvocation<unknown>,
  ): boolean {
    return handler.isEnabled?.(invocation) ?? true;
  }

  return {
    handle: (command, handler) => handledCommands.register({ command, handler }),
    isHandled: (command) => handlerOf(command) !== undefined,
    getState(command, invocation) {
      const handler = handlerOf(command);

      if (handler === undefined) {
        return UNHANDLED_STATE;
      }

      return {
        handled: true,
        enabled: isEnabled(handler, invocation),
        checked: handler.isChecked?.(invocation),
      };
    },
    execute(command, invocation) {
      const handler = handlerOf(command);

      if (handler === undefined || !isEnabled(handler, invocation)) {
        return false;
      }

      const result = handler.run(invocation);

      if (result instanceof Promise) {
        result.catch((error: unknown) => {
          reportCommandFailure(command.id, error);
        });
      }

      return true;
    },
    getHandledCommands: handledCommands.getSnapshot,
    refresh: changed,
    getVersion: () => version,
    subscribe(listener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
}
