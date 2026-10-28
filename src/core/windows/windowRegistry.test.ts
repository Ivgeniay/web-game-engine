import { describe, expect, it } from 'vitest';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { createWindowRegistry } from './windowRegistry';
import { defineWindow } from './windowType';

const messages = defineMessages({
  en: { scene: 'Scene' },
  ru: { scene: 'Сцена' },
});

function EmptyWindow() {
  return null;
}

const sceneWindow = defineWindow({
  id: 'test.scene',
  title: messageRef(messages, 'scene'),
  component: EmptyWindow,
});

describe('defineWindow', () => {
  it('makes a window single-instance by default', () => {
    expect(sceneWindow.multiInstance).toBe(false);
  });
});

describe('createWindowRegistry', () => {
  it('finds a registered window type by id until it is unregistered', () => {
    const registry = createWindowRegistry();
    const unregister = registry.register(sceneWindow);

    expect(registry.get('test.scene')).toBe(sceneWindow);

    unregister();

    expect(registry.get('test.scene')).toBeUndefined();
  });

  it('reports a duplicate window type id as a development error', () => {
    const registry = createWindowRegistry();
    registry.register(sceneWindow);

    expect(() => registry.register({ ...sceneWindow })).toThrow(/Duplicate window type id/);
  });
});
