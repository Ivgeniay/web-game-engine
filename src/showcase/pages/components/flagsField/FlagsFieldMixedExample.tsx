import { useState } from 'react';
import { FlagsField } from '@/ui/flagsField/FlagsField';
import { applyFlagsChange } from '@/ui/flagsField/flagsValue';
import type { FlagOption, FlagsChange } from '@/ui/flagsField/flagsValue';
import { Label } from '@/ui/label/Label';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { PropertyRowGroup } from '@/ui/propertyRow/PropertyRowGroup';
import styles from './FlagsFieldMixedExample.module.css';

type Axis = 'x' | 'y' | 'z';

const FREEZE_LABEL = 'Freeze position';
const NONE_LABEL = 'Nothing';
const ALL_LABEL = 'Everything';
const MIXED_LABEL = 'Mixed';
const OBJECT_CAPTION = 'Object';
const AXIS_OPTIONS: readonly FlagOption<Axis>[] = [
  { value: 'x', label: 'X' },
  { value: 'y', label: 'Y' },
  { value: 'z', label: 'Z' },
];
const INITIAL_OBJECTS: readonly (readonly Axis[])[] = [['x', 'y'], ['y']];

function commonFlags(objects: readonly (readonly Axis[])[]): FlagsChange<Axis> {
  const flags = AXIS_OPTIONS.map((option) => option.value);

  return {
    on: flags.filter((flag) => objects.every((object) => object.includes(flag))),
    mixed: flags.filter(
      (flag) =>
        objects.some((object) => object.includes(flag)) &&
        !objects.every((object) => object.includes(flag)),
    ),
  };
}

export function FlagsFieldMixedExample() {
  const [objects, setObjects] = useState(INITIAL_OBJECTS);
  const shown = commonFlags(objects);

  return (
    <div className={styles.root}>
      <PropertyRowGroup className={styles.rows}>
        <PropertyRow label={FREEZE_LABEL}>
          {({ id, labelId }) => (
            <FlagsField
              id={id}
              aria-labelledby={labelId}
              options={AXIS_OPTIONS}
              value={shown.on}
              mixedFlags={shown.mixed}
              noneLabel={NONE_LABEL}
              allLabel={ALL_LABEL}
              mixedLabel={MIXED_LABEL}
              onValueChange={(change) => {
                setObjects(objects.map((object) => applyFlagsChange(object, change, AXIS_OPTIONS)));
              }}
            />
          )}
        </PropertyRow>
      </PropertyRowGroup>
      {objects.map((object, index) => (
        <Label key={index} tone="secondary">
          {`${OBJECT_CAPTION} ${String(index + 1)}: ${object.join(' ')}`}
        </Label>
      ))}
    </div>
  );
}
