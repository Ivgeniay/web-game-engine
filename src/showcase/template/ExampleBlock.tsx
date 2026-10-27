import type { ReactNode } from 'react';
import { CodeBlock } from './CodeBlock';
import styles from './ExampleBlock.module.css';

export interface ExampleSource {
  readonly fileName: string;
  readonly code: string;
}

interface ExampleBlockProps {
  readonly sources: readonly ExampleSource[];
  readonly children: ReactNode;
}

export function ExampleBlock({ sources, children }: ExampleBlockProps) {
  return (
    <figure className={styles.root}>
      <div className={styles.demo}>{children}</div>
      {sources.map((source) => (
        <CodeBlock key={source.fileName} fileName={source.fileName} code={source.code} />
      ))}
    </figure>
  );
}
