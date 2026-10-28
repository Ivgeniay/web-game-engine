import { useState } from 'react';
import { useNumberFieldMessages } from '@/state/fields/useNumberFieldMessages';
import { Checkbox } from '@/ui/checkbox/Checkbox';
import { NumberField } from '@/ui/numberField/NumberField';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { PropertyRowGroup } from '@/ui/propertyRow/PropertyRowGroup';
import { Select } from '@/ui/select/Select';
import type { SelectEntry } from '@/ui/select/selectOptions';
import { TextField } from '@/ui/textField/TextField';
import styles from './PropertyRowExample.module.css';

type Interpolation = 'none' | 'interpolate' | 'extrapolate';

const NAME_LABEL = 'Name';
const MASS_LABEL = 'Mass';
const SOLVER_LABEL = 'Solver iterations';
const KINEMATIC_LABEL = 'Is kinematic';
const INTERPOLATION_LABEL = 'Interpolate';
const MIN_MASS = 0;
const MIN_ITERATIONS = 1;
const MAX_ITERATIONS = 255;

const INTERPOLATION_OPTIONS: readonly SelectEntry<Interpolation>[] = [
  { kind: 'option', value: 'none', label: 'None' },
  { kind: 'option', value: 'interpolate', label: 'Interpolate' },
  { kind: 'option', value: 'extrapolate', label: 'Extrapolate' },
];

export function PropertyRowExample() {
  const massMessages = useNumberFieldMessages({ min: MIN_MASS });
  const iterationMessages = useNumberFieldMessages({ min: MIN_ITERATIONS, max: MAX_ITERATIONS });
  const [name, setName] = useState('Player');
  const [mass, setMass] = useState(1);
  const [iterations, setIterations] = useState(6);
  const [kinematic, setKinematic] = useState(false);
  const [interpolation, setInterpolation] = useState<Interpolation>('none');

  return (
    <PropertyRowGroup className={styles.root}>
      <PropertyRow label={NAME_LABEL}>
        {({ id }) => <TextField id={id} value={name} onValueChange={setName} />}
      </PropertyRow>
      <PropertyRow label={MASS_LABEL} drag={{ value: mass, onValueChange: setMass, min: MIN_MASS }}>
        {({ id }) => (
          <NumberField
            id={id}
            value={mass}
            min={MIN_MASS}
            invalidMessages={massMessages}
            onValueChange={setMass}
          />
        )}
      </PropertyRow>
      <PropertyRow
        label={SOLVER_LABEL}
        drag={{
          value: iterations,
          onValueChange: setIterations,
          kind: 'integer',
          min: MIN_ITERATIONS,
          max: MAX_ITERATIONS,
        }}
      >
        {({ id }) => (
          <NumberField
            id={id}
            kind="integer"
            value={iterations}
            min={MIN_ITERATIONS}
            max={MAX_ITERATIONS}
            invalidMessages={iterationMessages}
            onValueChange={setIterations}
          />
        )}
      </PropertyRow>
      <PropertyRow label={KINEMATIC_LABEL}>
        {({ id, labelId }) => (
          <Checkbox
            id={id}
            aria-labelledby={labelId}
            checked={kinematic}
            onCheckedChange={setKinematic}
          />
        )}
      </PropertyRow>
      <PropertyRow label={INTERPOLATION_LABEL}>
        {({ id, labelId }) => (
          <Select
            id={id}
            aria-labelledby={labelId}
            options={INTERPOLATION_OPTIONS}
            value={interpolation}
            onValueChange={setInterpolation}
          />
        )}
      </PropertyRow>
    </PropertyRowGroup>
  );
}
