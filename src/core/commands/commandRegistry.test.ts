import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { defineCommand } from './command';
import type { CommandInvocation } from './command';
import { createCommandRegistry } from './commandRegistry';

const messages = defineMessages({
  en: { save: 'Save', rename: 'Rename' },
  ru: { save: 'Сохранить', rename: 'Переименовать' },
});

interface SceneObject {
  readonly name: string;
}

const saveScene = defineCommand({ id: 'scene.save', label: messageRef(messages, 'save') });
const anotherSave = defineCommand({ id: 'scene.save', label: messageRef(messages, 'save') });
const renameObject = defineCommand<SceneObject>({
  id: 'object.rename',
  label: messageRef(messages, 'rename'),
});

const FROM_TOOLBAR: CommandInvocation<undefined> = { source: 'toolbar', target: undefined };
const CUBE: SceneObject = { name: 'Cube' };

afterEach(() => {
  vi.restoreAllMocks();
});

describe('createCommandRegistry', () => {
  it('reports a command without a handler as unhandled and does not run it', () => {
    const registry = createCommandRegistry();

    expect(registry.getState(saveScene, FROM_TOOLBAR)).toEqual({
      handled: false,
      enabled: false,
      checked: undefined,
    });
    expect(registry.execute(saveScene, FROM_TOOLBAR)).toBe(false);
  });

  it('tells whether a command has a handler', () => {
    const registry = createCommandRegistry();
    const unhandle = registry.handle(saveScene, { run: vi.fn(), isEnabled: () => false });

    expect(registry.isHandled(saveScene)).toBe(true);
    expect(registry.isHandled(renameObject)).toBe(false);

    unhandle();

    expect(registry.isHandled(saveScene)).toBe(false);
  });

  it('runs the handler with the invocation', () => {
    const registry = createCommandRegistry();
    const run = vi.fn();
    registry.handle(renameObject, { run });
    const invocation: CommandInvocation<SceneObject> = { source: 'context-menu', target: CUBE };

    expect(registry.execute(renameObject, invocation)).toBe(true);
    expect(run).toHaveBeenCalledWith(invocation);
  });

  it('is enabled and has no check mark when the handler does not say otherwise', () => {
    const registry = createCommandRegistry();
    registry.handle(saveScene, { run: vi.fn() });

    expect(registry.getState(saveScene, FROM_TOOLBAR)).toEqual({
      handled: true,
      enabled: true,
      checked: undefined,
    });
  });

  it('evaluates availability and the check mark for the invocation', () => {
    const registry = createCommandRegistry();
    const isEnabled = vi.fn(() => false);
    const isChecked = vi.fn(() => true);
    registry.handle(saveScene, { run: vi.fn(), isEnabled, isChecked });

    expect(registry.getState(saveScene, FROM_TOOLBAR)).toEqual({
      handled: true,
      enabled: false,
      checked: true,
    });
    expect(isEnabled).toHaveBeenCalledWith(FROM_TOOLBAR);
    expect(isChecked).toHaveBeenCalledWith(FROM_TOOLBAR);
  });

  it('does not run a disabled command', () => {
    const registry = createCommandRegistry();
    const run = vi.fn();
    registry.handle(saveScene, { run, isEnabled: () => false });

    expect(registry.execute(saveScene, FROM_TOOLBAR)).toBe(false);
    expect(run).not.toHaveBeenCalled();
  });

  it('forgets the handler when its registration is cancelled', () => {
    const registry = createCommandRegistry();
    const run = vi.fn();
    const unhandle = registry.handle(saveScene, { run });

    unhandle();

    expect(registry.execute(saveScene, FROM_TOOLBAR)).toBe(false);
    expect(registry.getHandledCommands()).toEqual([]);
  });

  it('lists the handled commands', () => {
    const registry = createCommandRegistry();
    const handler = { run: vi.fn() };
    registry.handle(saveScene, handler);

    expect(registry.getHandledCommands()).toEqual([{ command: saveScene, handler }]);
  });

  it('throws on a second handler for the same command in development', () => {
    const registry = createCommandRegistry();
    registry.handle(saveScene, { run: vi.fn() });

    expect(() => registry.handle(saveScene, { run: vi.fn() })).toThrow(
      'Duplicate command id "scene.save".',
    );
  });

  it('throws on another definition with a handled id in development', () => {
    const registry = createCommandRegistry();
    registry.handle(saveScene, { run: vi.fn() });

    expect(() => registry.handle(anotherSave, { run: vi.fn() })).toThrow(
      'Duplicate command id "scene.save".',
    );
    expect(() => registry.execute(anotherSave, FROM_TOOLBAR)).toThrow(
      'Command id "scene.save" belongs to another definition.',
    );
  });

  it('reports a failed asynchronous command', async () => {
    const registry = createCommandRegistry();
    const error = new Error('Disk is full');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    registry.handle(saveScene, { run: () => Promise.reject(error) });

    registry.execute(saveScene, FROM_TOOLBAR);
    await vi.waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Command "scene.save" failed.', error);
    });
  });

  it('notifies subscribers and changes the version on handling and on refresh', () => {
    const registry = createCommandRegistry();
    const listener = vi.fn();
    registry.subscribe(listener);
    const initialVersion = registry.getVersion();

    const unhandle = registry.handle(saveScene, { run: vi.fn() });
    registry.refresh();
    unhandle();

    expect(listener).toHaveBeenCalledTimes(3);
    expect(registry.getVersion()).not.toBe(initialVersion);
  });

  it('keeps the version without changes', () => {
    const registry = createCommandRegistry();
    registry.handle(saveScene, { run: vi.fn() });
    const version = registry.getVersion();

    registry.getState(saveScene, FROM_TOOLBAR);
    registry.execute(saveScene, FROM_TOOLBAR);

    expect(registry.getVersion()).toBe(version);
  });

  it('keeps registries independent', () => {
    const first = createCommandRegistry();
    const second = createCommandRegistry();

    first.handle(saveScene, { run: vi.fn() });

    expect(second.getState(saveScene, FROM_TOOLBAR).handled).toBe(false);
  });
});
