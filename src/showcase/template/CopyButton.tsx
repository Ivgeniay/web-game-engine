import { frameworkIcons } from '@/icons/frameworkIcons';
import { Button } from '@/ui/button/Button';
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
    <Button
      variant="flat"
      size="sm"
      icon={frameworkIcons.copy}
      aria-live="polite"
      onClick={() => {
        copy(text);
      }}
    >
      {STATUS_LABELS[status]}
    </Button>
  );
}
