import { describe, expect, it } from 'vitest';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { splitLayout, tabsLayout } from '@/core/layout/layoutDescription';
import { defineWindow } from '@/core/windows/windowType';
import { isStoredLayout, serializeLayout, storedLayoutOf } from './layoutSerialization';

const messages = defineMessages({
  en: { window: 'Window' },
  ru: { window: 'Окно' },
});

function EmptyWindow() {
  return null;
}

function testWindow(id: string, multiInstance = false) {
  return defineWindow({
    id,
    title: messageRef(messages, 'window'),
    component: EmptyWindow,
    multiInstance,
  });
}

const sceneWindow = testWindow('test.scene');
const gameWindow = testWindow('test.game');
const hierarchyWindow = testWindow('test.hierarchy');
const inspectorWindow = testWindow('test.inspector', true);

describe('serializeLayout', () => {
  it('puts a single tab group into a root row', () => {
    const serialized = serializeLayout(tabsLayout([sceneWindow, gameWindow]));

    expect(serialized?.grid.orientation).toBe('HORIZONTAL');
    expect(serialized?.grid.root).toEqual({
      type: 'branch',
      size: 1000,
      data: [
        {
          type: 'leaf',
          size: 1000,
          data: { id: 'group-1', views: ['test.scene', 'test.game'], activeView: 'test.scene' },
        },
      ],
    });
  });

  it('makes the first group active', () => {
    const serialized = serializeLayout(
      splitLayout('row', [tabsLayout([hierarchyWindow]), tabsLayout([sceneWindow])]),
    );

    expect(serialized?.activeGroup).toBe('group-1');
  });

  it('describes every window as a panel with its type in the parameters', () => {
    const serialized = serializeLayout(tabsLayout([sceneWindow]));

    expect(serialized?.panels).toEqual({
      'test.scene': {
        id: 'test.scene',
        contentComponent: 'editor-window',
        params: { windowType: 'test.scene' },
      },
    });
  });

  it('numbers the instances of a multi-instance window', () => {
    const serialized = serializeLayout(
      splitLayout('row', [tabsLayout([inspectorWindow]), tabsLayout([inspectorWindow])]),
    );

    expect(Object.keys(serialized?.panels ?? {})).toEqual(['test.inspector:1', 'test.inspector:2']);
  });

  it('activates the requested window of a tab group', () => {
    const serialized = serializeLayout(
      tabsLayout([sceneWindow, gameWindow], { activeWindow: gameWindow }),
    );

    expect(serialized?.grid.root).toMatchObject({ data: [{ data: { activeView: 'test.game' } }] });
  });

  it('splits the size between children by weight and alternates the direction', () => {
    const serialized = serializeLayout(
      splitLayout('row', [
        tabsLayout([hierarchyWindow], { weight: 1 }),
        splitLayout('column', [tabsLayout([sceneWindow]), tabsLayout([gameWindow])], {
          weight: 3,
        }),
      ]),
    );

    expect(serialized?.grid.root.data).toMatchObject([
      { type: 'leaf', size: 250 },
      {
        type: 'branch',
        size: 750,
        data: [
          { type: 'leaf', size: 500 },
          { type: 'leaf', size: 500 },
        ],
      },
    ]);
  });

  it('merges a nested split of the same direction into its parent', () => {
    const serialized = serializeLayout(
      splitLayout('row', [
        tabsLayout([hierarchyWindow], { weight: 2 }),
        splitLayout('row', [tabsLayout([sceneWindow]), tabsLayout([gameWindow])], { weight: 2 }),
      ]),
    );

    expect(serialized?.grid.root.data).toMatchObject([
      { type: 'leaf', size: 500 },
      { type: 'leaf', size: 250 },
      { type: 'leaf', size: 250 },
    ]);
  });

  it('drops empty tab groups and returns null for a layout without windows', () => {
    expect(serializeLayout(splitLayout('row', [tabsLayout([]), tabsLayout([])]))).toBeNull();
    expect(
      serializeLayout(splitLayout('column', [tabsLayout([]), tabsLayout([sceneWindow])]))?.grid.root
        .data,
    ).toHaveLength(1);
  });
});

describe('isStoredLayout', () => {
  it('accepts a stored serialized layout', () => {
    const serialized = serializeLayout(tabsLayout([sceneWindow]));

    expect(serialized !== null && isStoredLayout(storedLayoutOf(serialized))).toBe(true);
  });

  it.each([
    null,
    'layout',
    [],
    {},
    { version: 2, current: {} },
    { version: 1, current: { panels: {} } },
    { version: 1, current: { grid: { root: {}, width: 1, height: 1 }, panels: {} } },
    { version: 1, current: { grid: { root: [], width: 1, height: 1, orientation: 'HORIZONTAL' } } },
  ])('rejects %j', (value) => {
    expect(isStoredLayout(value)).toBe(false);
  });
});
