import { useState } from 'react';
import type { Rect } from '@/contracts/geometry';
import { useNumberFieldMessages } from '@/state/fields/useNumberFieldMessages';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { PropertyRowGroup } from '@/ui/propertyRow/PropertyRowGroup';
import { RectField } from '@/ui/rectField/RectField';
import styles from './RectFieldExample.module.css';

const VIEWPORT_LABEL = 'Viewport rect';
const SPRITE_LABEL = 'Sprite rect';

export function RectFieldExample() {
  const invalidMessages = useNumberFieldMessages();
  const [viewport, setViewport] = useState<Rect>({ x: 0, y: 0, width: 1, height: 1 });
  const [sprite, setSprite] = useState<Rect>({ x: 32, y: 0, width: 64, height: 64 });

  return (
    <PropertyRowGroup className={styles.root}>
      <PropertyRow label={VIEWPORT_LABEL}>
        {({ id, labelId }) => (
          <RectField
            id={id}
            aria-labelledby={labelId}
            value={viewport}
            invalidMessages={invalidMessages}
            onValueChange={setViewport}
          />
        )}
      </PropertyRow>
      <PropertyRow label={SPRITE_LABEL}>
        {({ id, labelId }) => (
          <RectField
            id={id}
            aria-labelledby={labelId}
            kind="integer"
            value={sprite}
            invalidMessages={invalidMessages}
            onValueChange={setSprite}
          />
        )}
      </PropertyRow>
    </PropertyRowGroup>
  );
}
