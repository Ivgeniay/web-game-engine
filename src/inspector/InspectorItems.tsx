import { useState } from 'react';
import type { InspectorItem, PropertyGroup } from '@/contracts/inspector';
import { useTranslate } from '@/state/language/useTranslate';
import { SectionHeader } from '@/ui/sectionHeader/SectionHeader';
import { PropertyField } from './PropertyField';

interface InspectorItemsProps {
  readonly items: readonly InspectorItem[];
  readonly targetIds: readonly string[];
}

interface PropertyGroupFieldProps {
  readonly group: PropertyGroup;
  readonly targetIds: readonly string[];
}

function PropertyGroupField({ group, targetIds }: PropertyGroupFieldProps) {
  const translate = useTranslate();
  const [expanded, setExpanded] = useState(true);

  return (
    <SectionHeader
      label={translate(group.label)}
      expanded={expanded}
      onExpandedChange={setExpanded}
    >
      {group.properties.map((property) => (
        <PropertyField key={property.id} property={property} targetIds={targetIds} />
      ))}
    </SectionHeader>
  );
}

export function InspectorItems({ items, targetIds }: InspectorItemsProps) {
  return items.map((item) =>
    item.type === 'group' ? (
      <PropertyGroupField key={item.id} group={item} targetIds={targetIds} />
    ) : (
      <PropertyField key={item.id} property={item} targetIds={targetIds} />
    ),
  );
}
