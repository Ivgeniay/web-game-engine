import { useState } from 'react';
import { useNumberFieldMessages } from '@/state/fields/useNumberFieldMessages';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { PropertyRowGroup } from '@/ui/propertyRow/PropertyRowGroup';
import { Slider } from '@/ui/slider/Slider';
import styles from './SliderLogExample.module.css';

const RANGE_LABEL = 'Range';
const MIXED_LABEL = 'Spot angle';
const DISABLED_LABEL = 'Bounce';
const MIN_RANGE = 0.1;
const MAX_RANGE = 1000;
const MIN_ANGLE = 1;
const MAX_ANGLE = 179;
const BOUNCE = 1;
const MIN_BOUNCE = 0;
const MAX_BOUNCE = 2;

export function SliderLogExample() {
  const rangeMessages = useNumberFieldMessages({ min: MIN_RANGE, max: MAX_RANGE });
  const angleMessages = useNumberFieldMessages({ min: MIN_ANGLE, max: MAX_ANGLE });
  const bounceMessages = useNumberFieldMessages({ min: MIN_BOUNCE, max: MAX_BOUNCE });
  const [range, setRange] = useState(10);
  const [angle, setAngle] = useState(30);
  const [mixed, setMixed] = useState(true);

  return (
    <PropertyRowGroup className={styles.root}>
      <PropertyRow label={RANGE_LABEL}>
        {({ id, labelId }) => (
          <Slider
            id={id}
            aria-labelledby={labelId}
            scale="log"
            value={range}
            min={MIN_RANGE}
            max={MAX_RANGE}
            invalidMessages={rangeMessages}
            onValueChange={setRange}
          />
        )}
      </PropertyRow>
      <PropertyRow label={MIXED_LABEL}>
        {({ id, labelId }) => (
          <Slider
            id={id}
            aria-labelledby={labelId}
            value={angle}
            mixed={mixed}
            min={MIN_ANGLE}
            max={MAX_ANGLE}
            invalidMessages={angleMessages}
            onValueChange={(value) => {
              setAngle(value);
              setMixed(false);
            }}
          />
        )}
      </PropertyRow>
      <PropertyRow label={DISABLED_LABEL} disabled>
        {({ id, labelId }) => (
          <Slider
            id={id}
            aria-labelledby={labelId}
            value={BOUNCE}
            min={MIN_BOUNCE}
            max={MAX_BOUNCE}
            invalidMessages={bounceMessages}
            disabled
          />
        )}
      </PropertyRow>
    </PropertyRowGroup>
  );
}
