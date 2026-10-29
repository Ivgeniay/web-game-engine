import { useState } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { useNumberFieldMessages } from '@/state/fields/useNumberFieldMessages';
import { Checkbox } from '@/ui/checkbox/Checkbox';
import type { MenuItem } from '@/ui/menu/menuItems';
import { NumberField } from '@/ui/numberField/NumberField';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { PropertyRowGroup } from '@/ui/propertyRow/PropertyRowGroup';
import { SectionHeader } from '@/ui/sectionHeader/SectionHeader';
import styles from './SectionHeaderExample.module.css';

const SHADOWS_LABEL = 'Shadows';
const CAST_SHADOWS_LABEL = 'Cast shadows';
const STRENGTH_LABEL = 'Strength';
const MENU_LABEL = 'Shadows menu';
const RESET_LABEL = 'Reset';
const DEFAULT_STRENGTH = 1;

export function SectionHeaderExample() {
  const invalidMessages = useNumberFieldMessages();
  const [expanded, setExpanded] = useState(true);
  const [castShadows, setCastShadows] = useState(true);
  const [strength, setStrength] = useState(0.6);
  const menuItems: readonly MenuItem[] = [
    {
      kind: 'action',
      id: 'reset',
      label: RESET_LABEL,
      icon: frameworkIcons.reset,
      onSelect: () => {
        setCastShadows(true);
        setStrength(DEFAULT_STRENGTH);
      },
    },
  ];

  return (
    <PropertyRowGroup className={styles.root}>
      <SectionHeader
        label={SHADOWS_LABEL}
        expanded={expanded}
        onExpandedChange={setExpanded}
        menuItems={menuItems}
        menuLabel={MENU_LABEL}
      >
        <PropertyRow label={CAST_SHADOWS_LABEL}>
          {({ id, labelId }) => (
            <Checkbox
              id={id}
              aria-labelledby={labelId}
              checked={castShadows}
              onCheckedChange={setCastShadows}
            />
          )}
        </PropertyRow>
        <PropertyRow label={STRENGTH_LABEL}>
          {({ id }) => (
            <NumberField
              id={id}
              value={strength}
              invalidMessages={invalidMessages}
              onValueChange={setStrength}
            />
          )}
        </PropertyRow>
      </SectionHeader>
    </PropertyRowGroup>
  );
}
