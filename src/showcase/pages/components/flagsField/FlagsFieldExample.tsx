import { useState } from 'react';
import { FlagsField } from '@/ui/flagsField/FlagsField';
import type { FlagOption } from '@/ui/flagsField/flagsValue';
import { Label } from '@/ui/label/Label';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { PropertyRowGroup } from '@/ui/propertyRow/PropertyRowGroup';
import styles from './FlagsFieldExample.module.css';

type Layer = 'default' | 'water' | 'ui' | 'effects';

const CULLING_LABEL = 'Culling mask';
const NONE_LABEL = 'Nothing';
const ALL_LABEL = 'Everything';
const MIXED_LABEL = 'Mixed';
const COMMITTED_CAPTION = 'Layers:';
const LAYER_OPTIONS: readonly FlagOption<Layer>[] = [
  { value: 'default', label: 'Default' },
  { value: 'water', label: 'Water' },
  { value: 'ui', label: 'UI' },
  { value: 'effects', label: 'Effects' },
];

export function FlagsFieldExample() {
  const [layers, setLayers] = useState<readonly Layer[]>(['default', 'water']);

  return (
    <div className={styles.root}>
      <PropertyRowGroup className={styles.rows}>
        <PropertyRow label={CULLING_LABEL}>
          {({ id, labelId }) => (
            <FlagsField
              id={id}
              aria-labelledby={labelId}
              options={LAYER_OPTIONS}
              value={layers}
              noneLabel={NONE_LABEL}
              allLabel={ALL_LABEL}
              mixedLabel={MIXED_LABEL}
              onValueChange={(change) => {
                setLayers(change.on);
              }}
            />
          )}
        </PropertyRow>
      </PropertyRowGroup>
      <Label tone="secondary">{`${COMMITTED_CAPTION} ${layers.join(' ')}`}</Label>
    </div>
  );
}
