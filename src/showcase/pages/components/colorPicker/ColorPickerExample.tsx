import { useState } from 'react';
import type { Color } from '@/contracts/color';
import { useColorFieldLabels } from '@/state/fields/useColorFieldLabels';
import { colorToHex } from '@/ui/color/colorModel';
import type { ColorMode } from '@/ui/colorPicker/colorChannels';
import { ColorPicker } from '@/ui/colorPicker/ColorPicker';
import { Label } from '@/ui/label/Label';
import styles from './ColorPickerExample.module.css';

const COMMITTED_CAPTION = 'Committed:';
const SHOW_ALPHA_IN_HEX = true;

export function ColorPickerExample() {
  const labels = useColorFieldLabels();
  const [color, setColor] = useState<Color>({ r: 0.95, g: 0.6, b: 0.2, a: 1 });
  const [committed, setCommitted] = useState(color);
  const [mode, setMode] = useState<ColorMode>('hsv');

  return (
    <div className={styles.root}>
      <ColorPicker
        value={color}
        labels={labels}
        colorMode={mode}
        onColorModeChange={setMode}
        onValueChange={(next, phase) => {
          setColor(next);

          if (phase === 'commit') {
            setCommitted(next);
          }
        }}
      />
      <Label tone="secondary">
        {`${COMMITTED_CAPTION} #${colorToHex(committed, SHOW_ALPHA_IN_HEX)}`}
      </Label>
    </div>
  );
}
