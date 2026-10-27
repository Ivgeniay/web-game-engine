import { SHOWCASE_PAGES } from '@/showcase/navigation/pages';
import { pageHref } from '@/showcase/navigation/routing';
import { SHOWCASE_SECTION_IDS, SHOWCASE_SECTION_TITLES } from '@/showcase/navigation/showcasePage';
import type { ShowcasePage, ShowcaseSectionId } from '@/showcase/navigation/showcasePage';
import styles from './Sidebar.module.css';

interface SidebarProps {
  readonly currentPageId: string;
}

const NAVIGATION_LABEL = 'Showcase pages';

function groupPagesBySection(
  pages: readonly ShowcasePage[],
): ReadonlyMap<ShowcaseSectionId, readonly ShowcasePage[]> {
  const grouped = new Map<ShowcaseSectionId, ShowcasePage[]>();

  for (const page of pages) {
    grouped.set(page.section, [...(grouped.get(page.section) ?? []), page]);
  }

  return grouped;
}

const PAGES_BY_SECTION = groupPagesBySection(SHOWCASE_PAGES);

export function Sidebar({ currentPageId }: SidebarProps) {
  return (
    <nav className={styles.root} aria-label={NAVIGATION_LABEL}>
      {SHOWCASE_SECTION_IDS.map((section) => (
        <div key={section} className={styles.section}>
          <h2 className={styles.sectionTitle}>{SHOWCASE_SECTION_TITLES[section]}</h2>
          <ul className={styles.list}>
            {PAGES_BY_SECTION.get(section)?.map((page) => (
              <li key={page.id}>
                <a
                  className={styles.link}
                  href={pageHref(page.id)}
                  aria-current={page.id === currentPageId ? 'page' : undefined}
                >
                  {page.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
