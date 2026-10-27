import { useLayoutEffect, useRef } from 'react';
import { useCurrentPage } from '@/showcase/navigation/useCurrentPage';
import { Sidebar } from '@/showcase/shell/Sidebar';
import { ThemeSwitcher } from '@/showcase/shell/ThemeSwitcher';
import { useDocumentTitle } from '@/showcase/shell/useDocumentTitle';
import styles from './Showcase.module.css';

const SHOWCASE_TITLE = 'Showcase';
const DOCUMENT_TITLE_SEPARATOR = ' · ';

export function Showcase() {
  const page = useCurrentPage();
  const contentRef = useRef<HTMLElement>(null);
  const PageContent = page.component;

  useDocumentTitle(`${page.title}${DOCUMENT_TITLE_SEPARATOR}${SHOWCASE_TITLE}`);

  useLayoutEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [page.id]);

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <span className={styles.title}>{SHOWCASE_TITLE}</span>
        <ThemeSwitcher />
      </header>
      <div className={styles.body}>
        <Sidebar currentPageId={page.id} />
        <main ref={contentRef} className={styles.content}>
          <article className={styles.page}>
            <header className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>{page.title}</h1>
              <p className={styles.pageDescription}>{page.description}</p>
            </header>
            <PageContent key={page.id} />
          </article>
        </main>
      </div>
    </div>
  );
}
