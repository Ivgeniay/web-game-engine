import { useState } from 'react';
import { RadioGroup } from '@/ui/radioGroup/RadioGroup';
import type { RadioGroupOption } from '@/ui/radioGroup/RadioGroup';
import styles from './RadioGroupDisabledExample.module.css';

type Backend = 'webgl' | 'webgpu' | 'software';

const GROUP_LABEL = 'Graphics backend';

const BACKEND_OPTIONS: readonly RadioGroupOption<Backend>[] = [
  { value: 'webgl', label: 'WebGL 2' },
  { value: 'webgpu', label: 'WebGPU', disabled: true },
  { value: 'software', label: 'Software' },
];

export function RadioGroupDisabledExample() {
  const [backend, setBackend] = useState<Backend>('webgl');

  return (
    <div className={styles.root}>
      <RadioGroup
        label={GROUP_LABEL}
        options={BACKEND_OPTIONS}
        value={backend}
        onValueChange={setBackend}
      />
    </div>
  );
}
