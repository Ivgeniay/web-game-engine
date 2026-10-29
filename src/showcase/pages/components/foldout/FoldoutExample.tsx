import { useState } from 'react';
import { Foldout } from '@/ui/foldout/Foldout';
import { Label } from '@/ui/label/Label';
import styles from './FoldoutExample.module.css';

const QUALITY = 'Quality';
const SHADOWS = 'Shadows';
const CASCADES = 'Cascades';
const RESOLUTION = 'Resolution: 2048';
const DISTANCE = 'Distance: 150';
const CASCADE_COUNT = 'Count: 4';
const ANTI_ALIASING = 'Anti-aliasing: 4x';

export function FoldoutExample() {
  const [qualityExpanded, setQualityExpanded] = useState(true);
  const [shadowsExpanded, setShadowsExpanded] = useState(false);
  const [cascadesExpanded, setCascadesExpanded] = useState(false);

  return (
    <div className={styles.root}>
      <Foldout label={QUALITY} expanded={qualityExpanded} onExpandedChange={setQualityExpanded}>
        <Label>{ANTI_ALIASING}</Label>
        <Foldout label={SHADOWS} expanded={shadowsExpanded} onExpandedChange={setShadowsExpanded}>
          <Label>{RESOLUTION}</Label>
          <Label>{DISTANCE}</Label>
          <Foldout
            label={CASCADES}
            expanded={cascadesExpanded}
            onExpandedChange={setCascadesExpanded}
          >
            <Label>{CASCADE_COUNT}</Label>
          </Foldout>
        </Foldout>
      </Foldout>
    </div>
  );
}
