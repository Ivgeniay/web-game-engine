import { useCallback, useEffect, useState } from 'react';

export const COPY_STATUSES = ['idle', 'copied', 'failed'] as const;

export type CopyStatus = (typeof COPY_STATUSES)[number];

export interface ClipboardCopy {
  readonly status: CopyStatus;
  readonly copy: (text: string) => void;
}

const STATUS_RESET_DELAY_MS = 1500;

async function writeToClipboard(text: string): Promise<CopyStatus> {
  try {
    await navigator.clipboard.writeText(text);

    return 'copied';
  } catch {
    return 'failed';
  }
}

export function useCopyToClipboard(): ClipboardCopy {
  const [status, setStatus] = useState<CopyStatus>('idle');

  useEffect(() => {
    if (status === 'idle') {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setStatus('idle');
    }, STATUS_RESET_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [status]);

  const copy = useCallback((text: string) => {
    void writeToClipboard(text).then(setStatus);
  }, []);

  return { status, copy };
}
