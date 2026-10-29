import { useState } from 'react';
import type { Color } from '@/contracts/color';
import { useColorFieldLabels } from '@/state/fields/useColorFieldLabels';
import { colorToHex } from '@/ui/color/colorModel';
import { ColorField } from '@/ui/colorField/ColorField';
import { Label } from '@/ui/label/Label';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { PropertyRowGroup } from '@/ui/propertyRow/PropertyRowGroup';
import styles from './ColorFieldExample.module.css';

const TINT_LABEL = 'Tint';
const FOG_LABEL = 'Fog color';
const COMMITTED_CAPTION = 'Committed tint:';
const SHOW_ALPHA_IN_HEX = true;

export function ColorFieldExample() {
  const labels = useColorFieldLabels();
  const [tint, setTint] = useState<Color>({ r: 0.3, g: 0.7, b: 1, a: 0.6 });
  const [committed, setCommitted] = useState(tint);
  const [fog, setFog] = useState<Color>({ r: 0.5, g: 0.55, b: 0.6, a: 1 });

  return (
    <div className={styles.root}>
      <PropertyRowGroup className={styles.rows}>
        <PropertyRow label={TINT_LABEL}>
          {({ id, labelId }) => (
            <ColorField
              id={id}
              aria-labelledby={labelId}
              value={tint}
              labels={labels}
              onValueChange={(next, phase) => {
                setTint(next);

                if (phase !== 'preview') {
                  setCommitted(next);
                }
              }}
            />
          )}
        </PropertyRow>
        <PropertyRow label={FOG_LABEL}>
          {({ id, labelId }) => (
            <ColorField
              id={id}
              aria-labelledby={labelId}
              value={fog}
              showAlpha={false}
              labels={labels}
              onValueChange={setFog}
            />
          )}
        </PropertyRow>
      </PropertyRowGroup>
      <Label tone="secondary">
        {`${COMMITTED_CAPTION} #${colorToHex(committed, SHOW_ALPHA_IN_HEX)}`}
      </Label>
    </div>
  );
}
