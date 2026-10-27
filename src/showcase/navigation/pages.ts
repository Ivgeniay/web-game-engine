import { OverviewPage } from '@/showcase/pages/overview/OverviewPage';
import type { ShowcasePage } from './showcasePage';

export const OVERVIEW_PAGE_ID = 'overview';

export const SHOWCASE_PAGES: readonly ShowcasePage[] = [
  {
    id: OVERVIEW_PAGE_ID,
    section: 'overview',
    title: 'Overview',
    description:
      'What the editor framework is, how this showcase is organized and how to read its pages.',
    component: OverviewPage,
  },
];
