import { useState } from 'react';
import type { Bounds } from '@/contracts/geometry';
import { useNumberFieldMessages } from '@/state/fields/useNumberFieldMessages';
import { BoundsField } from '@/ui/boundsField/BoundsField';
import { PropertyRowGroup } from '@/ui/propertyRow/PropertyRowGroup';
import styles from './BoundsFieldExample.module.css';

const BOUNDS_LABEL = 'Bounds';
const CENTER_LABEL = 'Center';
const SIZE_LABEL = 'Size';

export function BoundsFieldExample() {
  const invalidMessages = useNumberFieldMessages();
  const [bounds, setBounds] = useState<Bounds>({ center: [0, 1, 0], size: [2, 2, 2] });

  return (
    <PropertyRowGroup className={styles.root}>
      <BoundsField
        label={BOUNDS_LABEL}
        centerLabel={CENTER_LABEL}
        sizeLabel={SIZE_LABEL}
        value={bounds}
        invalidMessages={invalidMessages}
        onValueChange={setBounds}
      />
    </PropertyRowGroup>
  );
}
