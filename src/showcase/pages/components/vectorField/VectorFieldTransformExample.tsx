import { useState } from 'react';
import { useNumberFieldMessages } from '@/state/fields/useNumberFieldMessages';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { PropertyRowGroup } from '@/ui/propertyRow/PropertyRowGroup';
import { VECTOR3_AXES } from '@/ui/vectorField/vectorAxes';
import { VectorField } from '@/ui/vectorField/VectorField';
import styles from './VectorFieldTransformExample.module.css';

const POSITION_LABEL = 'Position';
const ROTATION_LABEL = 'Rotation';
const SCALE_LABEL = 'Scale';

export function VectorFieldTransformExample() {
  const invalidMessages = useNumberFieldMessages();
  const [position, setPosition] = useState<readonly number[]>([0, 1.5, -4]);
  const [rotation, setRotation] = useState<readonly number[]>([0, 90, 0]);
  const [scale, setScale] = useState<readonly number[]>([1, 1, 1]);

  return (
    <PropertyRowGroup className={styles.root}>
      <PropertyRow label={POSITION_LABEL}>
        {({ id, labelId }) => (
          <VectorField
            id={id}
            aria-labelledby={labelId}
            axes={VECTOR3_AXES}
            value={position}
            invalidMessages={invalidMessages}
            onValueChange={setPosition}
          />
        )}
      </PropertyRow>
      <PropertyRow label={ROTATION_LABEL}>
        {({ id, labelId }) => (
          <VectorField
            id={id}
            aria-labelledby={labelId}
            axes={VECTOR3_AXES}
            value={rotation}
            step={1}
            invalidMessages={invalidMessages}
            onValueChange={setRotation}
          />
        )}
      </PropertyRow>
      <PropertyRow label={SCALE_LABEL}>
        {({ id, labelId }) => (
          <VectorField
            id={id}
            aria-labelledby={labelId}
            axes={VECTOR3_AXES}
            value={scale}
            invalidMessages={invalidMessages}
            onValueChange={setScale}
          />
        )}
      </PropertyRow>
    </PropertyRowGroup>
  );
}
