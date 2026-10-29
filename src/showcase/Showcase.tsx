import { useLayoutEffect, useRef } from 'react';
import { DocText } from '@/showcase/i18n/DocText';
import { useCurrentPage } from '@/showcase/navigation/useCurrentPage';
import { LanguageSwitcher } from '@/showcase/shell/LanguageSwitcher';
import { Sidebar } from '@/showcase/shell/Sidebar';
import { ThemeSwitcher } from '@/showcase/shell/ThemeSwitcher';
import { showcaseMessages } from '@/showcase/shell/showcaseMessages';
import { useDocumentTitle } from '@/showcase/shell/useDocumentTitle';
import { useMessages } from '@/state/language/useMessages';
import { useTranslate } from '@/state/language/useTranslate';
import styles from './Showcase.module.css';

const DOCUMENT_TITLE_SEPARATOR = ' · ';

export function Showcase() {
  const page = useCurrentPage();
  const contentRef = useRef<HTMLElement>(null);
  const translate = useTranslate();
  const showcaseTitle = useMessages(showcaseMessages)('showcaseTitle');
  const pageTitle = translate(page.title);
  const PageContent = page.component;

  useDocumentTitle(`${pageTitle}${DOCUMENT_TITLE_SEPARATOR}${showcaseTitle}`);

  useLayoutEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [page.id]);

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <span className={styles.title}>{showcaseTitle}</span>
        <div className={styles.controls}>
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </header>
      <div className={styles.body}>
        <Sidebar currentPageId={page.id} />
        <main ref={contentRef} className={styles.content}>
          <article className={styles.page}>
            <header className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>{pageTitle}</h1>
              <p className={styles.pageDescription}>
                <DocText text={translate(page.description)} />
              </p>
            </header>
            <PageContent key={page.id} />
          </article>
        </main>
      </div>
    </div>
  );
}
