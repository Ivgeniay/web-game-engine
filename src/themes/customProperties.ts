export const TOKEN_GROUPS = [
  'color',
  'font',
  'space',
  'size',
  'radius',
  'shadow',
  'z',
  'duration',
  'easing',
] as const;

export type TokenGroup = (typeof TOKEN_GROUPS)[number];

export type GroupedTokenNames = Readonly<Record<TokenGroup, readonly string[]>>;

const CUSTOM_PROPERTY_DECLARATION_PATTERN = /^\s*(--[a-z0-9-]+)\s*:/gm;
const CUSTOM_PROPERTY_PREFIX = '--';
const GROUP_SEPARATOR = '-';

export function parseCustomPropertyNames(css: string): string[] {
  const names = new Set<string>();

  for (const [, name] of css.matchAll(CUSTOM_PROPERTY_DECLARATION_PATTERN)) {
    if (name !== undefined) {
      names.add(name);
    }
  }

  return [...names];
}

export function getTokenGroup(name: string): TokenGroup {
  const group = TOKEN_GROUPS.find((candidate) =>
    name.startsWith(`${CUSTOM_PROPERTY_PREFIX}${candidate}${GROUP_SEPARATOR}`),
  );

  if (group === undefined) {
    throw new Error(`Token "${name}" does not start with a known group prefix`);
  }

  return group;
}

export function groupTokenNames(names: readonly string[]): GroupedTokenNames {
  const grouped: Record<TokenGroup, string[]> = {
    color: [],
    font: [],
    space: [],
    size: [],
    radius: [],
    shadow: [],
    z: [],
    duration: [],
    easing: [],
  };

  for (const name of names) {
    grouped[getTokenGroup(name)].push(name);
  }

  return grouped;
}
