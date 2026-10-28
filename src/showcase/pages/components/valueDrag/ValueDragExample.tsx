import { useState } from 'react';
import type { ValueChangePhase } from '@/contracts/valueChange';
import { classNames } from '@/ui/classNames';
import { Checkbox } from '@/ui/checkbox/Checkbox';
import { Label } from '@/ui/label/Label';
import { useValueDrag } from '@/ui/valueDrag/useValueDrag';
import styles from './ValueDragExample.module.css';

const ZONE_CAPTION = 'Drag to rotate';
const INFINITE_LABEL = 'Infinite drag with pointer lock';
const ANGLE_STEP = 1;
const DEGREE_SIGN = '°';

export function ValueDragExample() {
  const [angle, setAngle] = useState(0);
  const [phase, setPhase] = useState<ValueChangePhase | null>(null);
  const [infinite, setInfinite] = useState(false);
  const { dragging, zoneProps } = useValueDrag({
    value: angle,
    step: ANGLE_STEP,
    kind: 'integer',
    infinite,
    onValueChange: (value, nextPhase) => {
      setAngle(value);
      setPhase(nextPhase);
    },
  });

  return (
    <div className={styles.root}>
      <span {...zoneProps} className={classNames(styles.zone, zoneProps.className)}>
        <Label>{ZONE_CAPTION}</Label>
      </span>
      <Label tone={dragging ? 'primary' : 'secondary'}>
        {`${String(angle)}${DEGREE_SIGN} ${phase ?? ''}`}
      </Label>
      <Checkbox checked={infinite} onCheckedChange={setInfinite} label={INFINITE_LABEL} />
    </div>
  );
}
