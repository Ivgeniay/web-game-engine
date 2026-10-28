import type { WindowType } from '@/core/windows/windowType';

export const LAYOUT_DIRECTIONS = ['row', 'column'] as const;

export type LayoutDirection = (typeof LAYOUT_DIRECTIONS)[number];

export interface TabsLayout {
  readonly kind: 'tabs';
  readonly windows: readonly WindowType[];
  readonly activeWindow: WindowType | undefined;
  readonly weight: number;
}

export interface SplitLayout {
  readonly kind: 'split';
  readonly direction: LayoutDirection;
  readonly children: readonly LayoutNode[];
  readonly weight: number;
}

export type LayoutNode = TabsLayout | SplitLayout;

export interface TabsLayoutOptions {
  readonly activeWindow?: WindowType | undefined;
  readonly weight?: number | undefined;
}

export interface SplitLayoutOptions {
  readonly weight?: number | undefined;
}

const DEFAULT_WEIGHT = 1;

export function tabsLayout(
  windows: readonly WindowType[],
  { activeWindow, weight = DEFAULT_WEIGHT }: TabsLayoutOptions = {},
): TabsLayout {
  return { kind: 'tabs', windows, activeWindow, weight };
}

export function splitLayout(
  direction: LayoutDirection,
  children: readonly LayoutNode[],
  { weight = DEFAULT_WEIGHT }: SplitLayoutOptions = {},
): SplitLayout {
  return { kind: 'split', direction, children, weight };
}
