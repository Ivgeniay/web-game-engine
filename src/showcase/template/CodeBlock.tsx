import styles from './CodeBlock.module.css';
import { CopyButton } from './CopyButton';

interface CodeBlockProps {
  readonly fileName: string;
  readonly code: string;
}

export function CodeBlock({ fileName, code }: CodeBlockProps) {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <span className={styles.fileName}>{fileName}</span>
        <CopyButton text={code} />
      </div>
      <pre className={styles.code}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
