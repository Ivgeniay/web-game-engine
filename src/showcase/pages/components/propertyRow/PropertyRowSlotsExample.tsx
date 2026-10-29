import { useState } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { useNumberFieldMessages } from '@/state/fields/useNumberFieldMessages';
import { Label } from '@/ui/label/Label';
import type { MenuItem } from '@/contracts/menu';
import { NumberField } from '@/ui/numberField/NumberField';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { PropertyRowGroup } from '@/ui/propertyRow/PropertyRowGroup';
import styles from './PropertyRowSlotsExample.module.css';

const SECTION_LABEL = 'Shadow';
const STRENGTH_LABEL = 'Strength';
const BIAS_LABEL = 'Bias';
const RESET_LABEL = 'Reset to default';
const COPY_LABEL = 'Copy';
const PASTE_LABEL = 'Paste';
const DEFAULT_STRENGTH = 1;
const MIN_STRENGTH = 0;
const MAX_STRENGTH = 1;
const STRENGTH_STEP = 0.01;
const BIAS_STEP = 0.01;

export function PropertyRowSlotsExample() {
  const messages = useNumberFieldMessages({ min: MIN_STRENGTH, max: MAX_STRENGTH });
  const biasMessages = useNumberFieldMessages();
  const [strength, setStrength] = useState(0.8);
  const [bias, setBias] = useState(0.05);
  const [copied, setCopied] = useState<number | null>(null);
  const modified = strength !== DEFAULT_STRENGTH;

  const menuItems: readonly MenuItem[] = [
    {
      kind: 'action',
      id: 'copy',
      label: COPY_LABEL,
      icon: frameworkIcons.copy,
      onSelect: () => {
        setCopied(strength);
      },
    },
    {
      kind: 'action',
      id: 'paste',
      label: PASTE_LABEL,
      disabled: copied === null,
      onSelect: () => {
        setStrength(copied ?? strength);
      },
    },
    { kind: 'separator', id: 'separator' },
    {
      kind: 'action',
      id: 'reset',
      label: RESET_LABEL,
      icon: frameworkIcons.reset,
      disabled: !modified,
      onSelect: () => {
        setStrength(DEFAULT_STRENGTH);
      },
    },
  ];

  return (
    <PropertyRowGroup className={styles.root}>
      <Label tone="secondary">{SECTION_LABEL}</Label>
      <PropertyRow
        label={STRENGTH_LABEL}
        depth={1}
        menuItems={menuItems}
        modified={modified}
        reset={{
          label: RESET_LABEL,
          onReset: () => {
            setStrength(DEFAULT_STRENGTH);
          },
        }}
        drag={{
          value: strength,
          onValueChange: setStrength,
          min: MIN_STRENGTH,
          max: MAX_STRENGTH,
          step: STRENGTH_STEP,
        }}
      >
        {({ id }) => (
          <NumberField
            id={id}
            value={strength}
            min={MIN_STRENGTH}
            max={MAX_STRENGTH}
            step={STRENGTH_STEP}
            invalidMessages={messages}
            onValueChange={setStrength}
          />
        )}
      </PropertyRow>
      <PropertyRow
        label={BIAS_LABEL}
        depth={1}
        modified={false}
        drag={{ value: bias, onValueChange: setBias, step: BIAS_STEP }}
      >
        {({ id }) => (
          <NumberField
            id={id}
            value={bias}
            step={BIAS_STEP}
            invalidMessages={biasMessages}
            onValueChange={setBias}
          />
        )}
      </PropertyRow>
    </PropertyRowGroup>
  );
}
