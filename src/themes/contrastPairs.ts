export const CONTRAST_PAIR_KINDS = ['text', 'indicator', 'border'] as const;

export type ContrastPairKind = (typeof CONTRAST_PAIR_KINDS)[number];

export interface ContrastPair {
  readonly foreground: string;
  readonly background: string;
  readonly kind: ContrastPairKind;
}

const TEXT_MIN_CONTRAST = 4.5;
const NON_TEXT_MIN_CONTRAST = 3;

export const MIN_CONTRAST_BY_KIND: Readonly<Record<ContrastPairKind, number>> = {
  text: TEXT_MIN_CONTRAST,
  indicator: NON_TEXT_MIN_CONTRAST,
  border: NON_TEXT_MIN_CONTRAST,
};

const SURFACE_BACKGROUNDS = ['bg-panel', 'bg-header', 'bg-field', 'bg-popup'];
const TEXT_ON_SURFACES = ['text-primary', 'text-secondary'];
const CONTROL_BACKGROUNDS = ['bg-control'];
const SELECTION_BACKGROUNDS = ['bg-selection', 'bg-selection-inactive'];
const ACCENT_BACKGROUNDS = ['accent', 'accent-hover', 'accent-active'];
const STATUS_INDICATORS = ['status-error', 'status-warning', 'status-success', 'status-info'];
const FOCUS_BORDERS = ['border-focus', 'border-drop-indicator'];

function combinePairs(
  foregrounds: readonly string[],
  backgrounds: readonly string[],
  kind: ContrastPairKind,
): ContrastPair[] {
  return foregrounds.flatMap((foreground) =>
    backgrounds.map((background) => ({ foreground, background, kind })),
  );
}

export const CONTRAST_PAIRS: readonly ContrastPair[] = [
  ...combinePairs(TEXT_ON_SURFACES, SURFACE_BACKGROUNDS, 'text'),
  ...combinePairs(TEXT_ON_SURFACES, CONTROL_BACKGROUNDS, 'text'),
  ...combinePairs(['text-primary'], SELECTION_BACKGROUNDS, 'text'),
  ...combinePairs(['text-on-accent'], ACCENT_BACKGROUNDS, 'text'),
  ...combinePairs(STATUS_INDICATORS, SURFACE_BACKGROUNDS, 'indicator'),
  ...combinePairs(FOCUS_BORDERS, SURFACE_BACKGROUNDS, 'border'),
];
