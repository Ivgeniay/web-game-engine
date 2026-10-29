import type { MessageRef } from '@/core/i18n/translate';
import type { Unsubscribe } from '@/core/unsubscribe';
import type { IconSource } from '@/icons/icon';
import type { PropertyAccess, PropertyDescription } from './property';

export interface PropertyGroup {
  readonly type: 'group';
  readonly id: string;
  readonly label: MessageRef;
  readonly properties: readonly PropertyDescription[];
}

export type InspectorItem = PropertyDescription | PropertyGroup;

export interface InspectorSection {
  readonly id: string;
  readonly type: string;
  readonly title: MessageRef;
  readonly icon?: IconSource | undefined;
  readonly enabled?: PropertyAccess<boolean> | undefined;
  readonly items: readonly InspectorItem[];
}

export interface InspectorSource {
  readonly getSections: (targetIds: readonly string[]) => readonly InspectorSection[];
  readonly subscribe: (listener: () => void) => Unsubscribe;
}

export interface InspectorSectionProps {
  readonly section: InspectorSection;
  readonly targetIds: readonly string[];
  readonly expanded: boolean;
  readonly onExpandedChange: (expanded: boolean) => void;
}

export interface InspectorSectionTarget {
  readonly section: InspectorSection;
  readonly targetIds: readonly string[];
}

export interface InspectorPropertyTarget {
  readonly property: PropertyDescription;
  readonly targetIds: readonly string[];
}
