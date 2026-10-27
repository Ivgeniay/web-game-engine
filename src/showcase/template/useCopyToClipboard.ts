import { useCallback, useEffect, useState } from 'react';

export const COPY_STATUSES = ['idle', 'copied', 'failed'] as const;

export type CopyStatus = (typeof COPY_STATUSES)[number];

export interface ClipboardCopy {
  readonly status: CopyStatus;
  readonly copy: (text: string) => void;
}

interface CopyResult {
  readonly status: CopyStatus;
  readonly attempt: number;
}

const STATUS_RESET_DELAY_MS = 1500;

const INITIAL_RESULT: CopyResult = { status: 'idle', attempt: 0 };

async function writeToClipboard(text: string): Promise<CopyStatus> {
  try {
    await navigator.clipboard.writeText(text);

    return 'copied';
  } catch {
    return 'failed';
  }
}

export function useCopyToClipboard(): ClipboardCopy {
  const [result, setResult] = useState<CopyResult>(INITIAL_RESULT);

  useEffect(() => {
    if (result.status === 'idle') {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setResult((current) => ({ ...current, status: 'idle' }));
    }, STATUS_RESET_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [result]);

  const copy = useCallback((text: string) => {
    void writeToClipboard(text).then((status) => {
      setResult((current) => ({ status, attempt: current.attempt + 1 }));
    });
  }, []);

  return { status: result.status, copy };
}
