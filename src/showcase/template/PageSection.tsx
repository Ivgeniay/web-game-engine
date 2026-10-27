import type { ReactNode } from 'react';
import styles from './PageSection.module.css';

interface PageSectionProps {
  readonly title: string;
  readonly children: ReactNode;
}

export function PageSection({ title, children }: PageSectionProps) {
  return (
    <section className={styles.root}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
