import { useState } from 'react';
import { useNumberFieldMessages } from '@/state/fields/useNumberFieldMessages';
import { Label } from '@/ui/label/Label';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { PropertyRowGroup } from '@/ui/propertyRow/PropertyRowGroup';
import { Slider } from '@/ui/slider/Slider';
import styles from './SliderExample.module.css';

const INTENSITY_LABEL = 'Intensity';
const SAMPLES_LABEL = 'Shadow samples';
const COMMITTED_CAPTION = 'Committed:';
const MIN_INTENSITY = 0;
const MAX_INTENSITY = 8;
const MIN_SAMPLES = 1;
const MAX_SAMPLES = 64;
const INTENSITY_PRECISION = 2;

export function SliderExample() {
  const intensityMessages = useNumberFieldMessages({ min: MIN_INTENSITY, max: MAX_INTENSITY });
  const samplesMessages = useNumberFieldMessages({ min: MIN_SAMPLES, max: MAX_SAMPLES });
  const [intensity, setIntensity] = useState(1.5);
  const [committed, setCommitted] = useState(intensity);
  const [samples, setSamples] = useState(16);

  return (
    <div className={styles.root}>
      <PropertyRowGroup className={styles.rows}>
        <PropertyRow label={INTENSITY_LABEL}>
          {({ id, labelId }) => (
            <Slider
              id={id}
              aria-labelledby={labelId}
              value={intensity}
              min={MIN_INTENSITY}
              max={MAX_INTENSITY}
              precision={INTENSITY_PRECISION}
              invalidMessages={intensityMessages}
              onValueChange={(value, phase) => {
                setIntensity(value);

                if (phase === 'commit') {
                  setCommitted(value);
                }
              }}
            />
          )}
        </PropertyRow>
        <PropertyRow label={SAMPLES_LABEL}>
          {({ id, labelId }) => (
            <Slider
              id={id}
              aria-labelledby={labelId}
              kind="integer"
              value={samples}
              min={MIN_SAMPLES}
              max={MAX_SAMPLES}
              invalidMessages={samplesMessages}
              onValueChange={setSamples}
            />
          )}
        </PropertyRow>
      </PropertyRowGroup>
      <Label tone="secondary">{`${COMMITTED_CAPTION} ${String(committed)}`}</Label>
    </div>
  );
}
