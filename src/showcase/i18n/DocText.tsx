import { pageHref } from '@/showcase/navigation/routing';
import styles from './DocText.module.css';
import { parseDocText } from './parseDocText';
import type { DocInlineSegment, DocSegment } from './parseDocText';

interface DocTextProps {
  readonly text: string;
}

function renderInline(segment: DocInlineSegment, index: number) {
  return segment.kind === 'code' ? (
    <code key={index} className={styles.code}>
      {segment.text}
    </code>
  ) : (
    segment.text
  );
}

function renderSegment(segment: DocSegment, index: number) {
  switch (segment.kind) {
    case 'text':
    case 'code':
      return renderInline(segment, index);
    case 'strong':
      return <strong key={index}>{segment.children.map(renderInline)}</strong>;
    case 'link':
      return (
        <a key={index} className={styles.link} href={pageHref(segment.pageId)}>
          {segment.children.map(renderInline)}
        </a>
      );
  }
}

export function DocText({ text }: DocTextProps) {
  return <>{parseDocText(text).map(renderSegment)}</>;
}
