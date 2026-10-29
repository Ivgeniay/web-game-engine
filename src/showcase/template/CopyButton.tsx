import { frameworkIcons } from '@/icons/frameworkIcons';
import { showcaseMessages } from '@/showcase/shell/showcaseMessages';
import { useMessages } from '@/state/language/useMessages';
import { Button } from '@/ui/button/Button';
import { useCopyToClipboard } from './useCopyToClipboard';
import type { CopyStatus } from './useCopyToClipboard';

interface CopyButtonProps {
  readonly text: string;
}

const STATUS_KEYS = {
  idle: 'copy',
  copied: 'copied',
  failed: 'copyFailed',
} as const satisfies Record<CopyStatus, string>;

export function CopyButton({ text }: CopyButtonProps) {
  const { status, copy } = useCopyToClipboard();
  const t = useMessages(showcaseMessages);

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
      {t(STATUS_KEYS[status])}
    </Button>
  );
}
