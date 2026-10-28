import { useRef, useState } from 'react';
import { Button } from '@/ui/button/Button';
import { Dialog } from '@/ui/dialog/Dialog';
import { Label } from '@/ui/label/Label';
import styles from './DialogConfirmExample.module.css';

const OPEN_LABEL = 'Revert changes…';
const TITLE = 'Revert unsaved changes?';
const DESCRIPTION = 'All changes since the last save will be lost.';
const KEEP_LABEL = 'Keep';
const REVERT_LABEL = 'Revert';
const KEPT = 'Changes kept';
const REVERTED = 'Changes reverted';

export function DialogConfirmExample() {
  const revertRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState('');

  function answer(text: string) {
    setResult(text);
    setOpen(false);
  }

  return (
    <div className={styles.root}>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        {OPEN_LABEL}
      </Button>
      <Label tone="secondary">{result}</Label>
      <Dialog
        open={open}
        onClose={() => {
          answer(KEPT);
        }}
        title={TITLE}
        description={DESCRIPTION}
        initialFocus={revertRef}
        onSubmit={() => {
          answer(REVERTED);
        }}
        actions={
          <>
            <Button
              onClick={() => {
                answer(KEPT);
              }}
            >
              {KEEP_LABEL}
            </Button>
            <Button ref={revertRef} type="submit" variant="accent">
              {REVERT_LABEL}
            </Button>
          </>
        }
      />
    </div>
  );
}
