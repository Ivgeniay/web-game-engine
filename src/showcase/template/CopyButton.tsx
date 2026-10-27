import styles from './CopyButton.module.css';
import { useCopyToClipboard } from './useCopyToClipboard';
import type { CopyStatus } from './useCopyToClipboard';

interface CopyButtonProps {
  readonly text: string;
}

const STATUS_LABELS: Readonly<Record<CopyStatus, string>> = {
  idle: 'Copy',
  copied: 'Copied',
  failed: 'Copy failed',
};

export function CopyButton({ text }: CopyButtonProps) {
  const { status, copy } = useCopyToClipboard();

  return (
    <button
      className={styles.root}
      type="button"
      aria-live="polite"
      onClick={() => {
        copy(text);
      }}
    >
      {STATUS_LABELS[status]}
    </button>
  );
}
