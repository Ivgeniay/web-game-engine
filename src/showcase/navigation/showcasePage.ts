import type { ComponentType } from 'react';

export const SHOWCASE_SECTION_IDS = ['overview', 'foundations', 'components', 'shell'] as const;

export type ShowcaseSectionId = (typeof SHOWCASE_SECTION_IDS)[number];

export const SHOWCASE_SECTION_TITLES: Readonly<Record<ShowcaseSectionId, string>> = {
  overview: 'Overview',
  foundations: 'Foundations',
  components: 'Components',
  shell: 'Shell',
};

export interface ShowcasePage {
  readonly id: string;
  readonly section: ShowcaseSectionId;
  readonly title: string;
  readonly description: string;
  readonly component: ComponentType;
}
