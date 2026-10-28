import { useEffect, useRef } from 'react';

export function useCloseWhenAnchorHides(
  open: boolean,
  anchorHidden: boolean | undefined,
  onOpenChange: (open: boolean) => void,
): void {
  const anchorWasVisible = useRef(false);

  useEffect(() => {
    if (!open) {
      anchorWasVisible.current = false;
      return;
    }
    if (anchorHidden === false) {
      anchorWasVisible.current = true;
      return;
    }
    if (anchorHidden === true && anchorWasVisible.current) {
      onOpenChange(false);
    }
  }, [open, anchorHidden, onOpenChange]);
}
