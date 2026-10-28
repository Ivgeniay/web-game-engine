import { Orientation } from 'dockview-react';
import type { GroupviewPanelState, SerializedDockview } from 'dockview-react';
import type { LayoutDirection, LayoutNode, TabsLayout } from '@/core/layout/layoutDescription';
import { windowInstanceId } from '@/core/windows/workspace';
import type { WindowType } from '@/core/windows/windowType';
import type { SettingDefinition } from '@/state/storage/settingStorage';
import { WINDOW_PANEL_COMPONENT, windowPanelParams } from './windowPanelParams';

export const LAYOUT_STORAGE_KEY = 'editor-layout';

export const LAYOUT_FORMAT_VERSION = 1;

export interface StoredLayout {
  readonly version: typeof LAYOUT_FORMAT_VERSION;
  readonly current: SerializedDockview;
}

type SerializedGridNode = SerializedDockview['grid']['root'];

const REFERENCE_SIZE = 1000;
const GROUP_ID_PREFIX = 'group-';
const FIRST_GROUP_NUMBER = 1;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSerializedDockview(value: unknown): value is SerializedDockview {
  if (!isRecord(value) || !isRecord(value.grid) || !isRecord(value.panels)) {
    return false;
  }

  const { root, width, height, orientation } = value.grid;

  return (
    isRecord(root) &&
    typeof width === 'number' &&
    typeof height === 'number' &&
    (orientation === Orientation.HORIZONTAL || orientation === Orientation.VERTICAL)
  );
}

export function isStoredLayout(value: unknown): value is StoredLayout {
  return (
    isRecord(value) &&
    value.version === LAYOUT_FORMAT_VERSION &&
    isSerializedDockview(value.current)
  );
}

export function layoutSetting(key: string): SettingDefinition<StoredLayout | null> {
  return { key, defaultValue: null, isValid: isStoredLayout };
}

export function storedLayoutOf(current: SerializedDockview): StoredLayout {
  return { version: LAYOUT_FORMAT_VERSION, current };
}

export function dockedPartOf({
  grid,
  panels,
  activeGroup,
}: SerializedDockview): SerializedDockview {
  return activeGroup === undefined ? { grid, panels } : { grid, panels, activeGroup };
}

function orientationOf(direction: LayoutDirection): Orientation {
  return direction === 'row' ? Orientation.HORIZONTAL : Orientation.VERTICAL;
}

function totalWeight(nodes: readonly LayoutNode[]): number {
  return nodes.reduce((sum, node) => sum + node.weight, 0);
}

function withWeight(node: LayoutNode, weight: number): LayoutNode {
  return { ...node, weight };
}

function normalize(node: LayoutNode): LayoutNode | null {
  if (node.kind === 'tabs') {
    return node.windows.length === 0 ? null : node;
  }

  const children = node.children.flatMap((child) => {
    const normalized = normalize(child);

    if (normalized === null) {
      return [];
    }

    if (normalized.kind === 'split' && normalized.direction === node.direction) {
      const sum = totalWeight(normalized.children);

      return normalized.children.map((grandchild) =>
        withWeight(grandchild, (normalized.weight * grandchild.weight) / sum),
      );
    }

    return [normalized];
  });

  const [onlyChild] = children;

  if (onlyChild === undefined) {
    return null;
  }

  if (children.length === 1) {
    return withWeight(onlyChild, node.weight);
  }

  return { ...node, children };
}

export function serializeLayout(layout: LayoutNode): SerializedDockview | null {
  const root = normalize(layout);

  if (root === null) {
    return null;
  }

  const panels: Record<string, GroupviewPanelState> = {};
  const instanceCounts = new Map<string, number>();
  let groupCount = 0;

  function addPanel(windowType: WindowType): string {
    const instanceNumber = (instanceCounts.get(windowType.id) ?? 0) + 1;
    instanceCounts.set(windowType.id, instanceNumber);
    const id = windowType.multiInstance
      ? windowInstanceId(windowType.id, instanceNumber)
      : windowType.id;
    panels[id] = {
      id,
      contentComponent: WINDOW_PANEL_COMPONENT,
      params: windowPanelParams(windowType.id),
    };

    return id;
  }

  function serializeTabs(node: TabsLayout, size: number): SerializedGridNode {
    const views = node.windows.map(addPanel);
    const activeView =
      views[node.activeWindow === undefined ? 0 : node.windows.indexOf(node.activeWindow)];
    groupCount += 1;
    const id = `${GROUP_ID_PREFIX}${String(groupCount)}`;

    return {
      type: 'leaf',
      data: activeView === undefined ? { id, views } : { id, views, activeView },
      size,
    };
  }

  function serializeNode(node: LayoutNode, size: number, crossSize: number): SerializedGridNode {
    if (node.kind === 'tabs') {
      return serializeTabs(node, size);
    }

    return { type: 'branch', data: serializeChildren(node.children, crossSize, size), size };
  }

  function serializeChildren(
    nodes: readonly LayoutNode[],
    mainSize: number,
    crossSize: number,
  ): SerializedGridNode[] {
    const sum = totalWeight(nodes);

    return nodes.map((child) => serializeNode(child, (mainSize * child.weight) / sum, crossSize));
  }

  const split = root.kind === 'split' ? root : null;
  const data = serializeChildren(split?.children ?? [root], REFERENCE_SIZE, REFERENCE_SIZE);

  return {
    grid: {
      root: { type: 'branch', data, size: REFERENCE_SIZE },
      width: REFERENCE_SIZE,
      height: REFERENCE_SIZE,
      orientation: split === null ? Orientation.HORIZONTAL : orientationOf(split.direction),
    },
    panels,
    activeGroup: `${GROUP_ID_PREFIX}${String(FIRST_GROUP_NUMBER)}`,
  };
}
