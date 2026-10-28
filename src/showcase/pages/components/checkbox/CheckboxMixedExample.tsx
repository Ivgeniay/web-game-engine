import { useState } from 'react';
import { Checkbox } from '@/ui/checkbox/Checkbox';
import type { CheckboxChecked } from '@/ui/checkbox/Checkbox';
import styles from './CheckboxMixedExample.module.css';

const LAYERS = ['Default', 'Water', 'UI'] as const;

type Layer = (typeof LAYERS)[number];

const ALL_LABEL = 'All layers';

function summarize(visible: readonly Layer[]): CheckboxChecked {
  if (visible.length === 0) {
    return false;
  }

  return visible.length === LAYERS.length ? true : 'mixed';
}

export function CheckboxMixedExample() {
  const [visible, setVisible] = useState<readonly Layer[]>(['Default']);

  return (
    <div className={styles.root}>
      <Checkbox
        checked={summarize(visible)}
        onCheckedChange={(checked) => {
          setVisible(checked ? LAYERS : []);
        }}
        label={ALL_LABEL}
      />
      <div className={styles.children}>
        {LAYERS.map((layer) => (
          <Checkbox
            key={layer}
            checked={visible.includes(layer)}
            onCheckedChange={(checked) => {
              setVisible(
                LAYERS.filter((item) => (item === layer ? checked : visible.includes(item))),
              );
            }}
            label={layer}
          />
        ))}
      </div>
    </div>
  );
}
