import { groupTokenNames, parseCustomPropertyNames } from '@/themes/customProperties';
import type { GroupedTokenNames } from '@/themes/customProperties';
import darkCss from '@/themes/dark.css?raw';
import tokensCss from '@/themes/tokens.css?raw';

export const SIZE_TOKEN_KINDS = [
  'control',
  'panel',
  'icon',
  'border',
  'scrollbar',
  'property',
  'list',
  'field',
] as const;

export type SizeTokenKind = (typeof SIZE_TOKEN_KINDS)[number];

export const SIZE_TOKEN_PREFIXES: Readonly<Record<SizeTokenKind, readonly string[]>> = {
  control: ['--size-control-'],
  panel: ['--size-menubar-', '--size-toolbar-', '--size-tab-', '--size-statusbar-'],
  icon: ['--size-icon-'],
  border: ['--size-border-'],
  scrollbar: ['--size-scrollbar'],
  property: ['--size-property-'],
  list: ['--size-list-', '--size-tree-', '--size-drop-'],
  field: ['--size-slider-'],
};

export const GROUPED_TOKEN_NAMES: GroupedTokenNames = groupTokenNames([
  ...parseCustomPropertyNames(darkCss),
  ...parseCustomPropertyNames(tokensCss),
]);

export function filterTokenNames(
  names: readonly string[],
  prefixes: readonly string[],
): readonly string[] {
  return names.filter((name) => prefixes.some((prefix) => name.startsWith(prefix)));
}

export function getSizeTokenNames(kind: SizeTokenKind): readonly string[] {
  return filterTokenNames(GROUPED_TOKEN_NAMES.size, SIZE_TOKEN_PREFIXES[kind]);
}
