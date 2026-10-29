import { useState } from 'react';
import type { Color } from '@/contracts/color';
import { useColorFieldLabels } from '@/state/fields/useColorFieldLabels';
import { ColorField } from '@/ui/colorField/ColorField';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { PropertyRowGroup } from '@/ui/propertyRow/PropertyRowGroup';
import styles from './ColorFieldStatesExample.module.css';

const MIXED_LABEL = 'Emission';
const DISABLED_LABEL = 'Ambient';
const AMBIENT: Color = { r: 0.2, g: 0.2, b: 0.25, a: 1 };

export function ColorFieldStatesExample() {
  const labels = useColorFieldLabels();
  const [emission, setEmission] = useState<Color>({ r: 1, g: 0.4, b: 0, a: 1 });
  const [mixed, setMixed] = useState(true);

  return (
    <PropertyRowGroup className={styles.root}>
      <PropertyRow label={MIXED_LABEL}>
        {({ id, labelId }) => (
          <ColorField
            id={id}
            aria-labelledby={labelId}
            value={emission}
            mixed={mixed}
            labels={labels}
            onValueChange={(next, phase) => {
              setEmission(next);

              if (phase === 'commit') {
                setMixed(false);
              }
            }}
          />
        )}
      </PropertyRow>
      <PropertyRow label={DISABLED_LABEL} disabled>
        {({ id, labelId }) => (
          <ColorField id={id} aria-labelledby={labelId} value={AMBIENT} labels={labels} disabled />
        )}
      </PropertyRow>
    </PropertyRowGroup>
  );
}
