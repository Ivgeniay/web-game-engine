import { Kbd } from '@/ui/kbd/Kbd';
import { Label } from '@/ui/label/Label';
import styles from './KbdExample.module.css';

interface ShortcutRow {
  readonly action: string;
  readonly mac: string;
  readonly windows: string;
}

const PLATFORM_CAPTIONS = { action: 'Action', mac: 'macOS', windows: 'Windows and Linux' };

const SHORTCUTS: readonly ShortcutRow[] = [
  { action: 'Save', mac: '⌘S', windows: 'Ctrl+S' },
  { action: 'Save as', mac: '⇧⌘S', windows: 'Ctrl+Shift+S' },
  { action: 'Duplicate', mac: '⌘D', windows: 'Ctrl+D' },
  { action: 'Frame selected', mac: 'F', windows: 'F' },
];

export function KbdExample() {
  return (
    <div className={styles.root}>
      <Label tone="secondary">{PLATFORM_CAPTIONS.action}</Label>
      <Label tone="secondary">{PLATFORM_CAPTIONS.mac}</Label>
      <Label tone="secondary">{PLATFORM_CAPTIONS.windows}</Label>
      {SHORTCUTS.map((shortcut) => (
        <ShortcutCells key={shortcut.action} shortcut={shortcut} />
      ))}
    </div>
  );
}

interface ShortcutCellsProps {
  readonly shortcut: ShortcutRow;
}

function ShortcutCells({ shortcut }: ShortcutCellsProps) {
  return (
    <>
      <Label>{shortcut.action}</Label>
      <Kbd>{shortcut.mac}</Kbd>
      <Kbd>{shortcut.windows}</Kbd>
    </>
  );
}
