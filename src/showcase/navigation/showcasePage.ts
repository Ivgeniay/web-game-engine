import type { ComponentType } from 'react';
import { messageRef } from '@/core/i18n/translate';
import type { MessageRef } from '@/core/i18n/translate';
import { showcaseMessages } from '@/showcase/shell/showcaseMessages';

export const SHOWCASE_SECTION_IDS = ['overview', 'foundations', 'components', 'shell'] as const;

export type ShowcaseSectionId = (typeof SHOWCASE_SECTION_IDS)[number];

export const SHOWCASE_SECTION_TITLES: Readonly<Record<ShowcaseSectionId, MessageRef>> = {
  overview: messageRef(showcaseMessages, 'sectionOverview'),
  foundations: messageRef(showcaseMessages, 'sectionFoundations'),
  components: messageRef(showcaseMessages, 'sectionComponents'),
  shell: messageRef(showcaseMessages, 'sectionShell'),
};

export interface ShowcasePage {
  readonly id: string;
  readonly section: ShowcaseSectionId;
  readonly title: MessageRef;
  readonly description: MessageRef;
  readonly component: ComponentType;
}
