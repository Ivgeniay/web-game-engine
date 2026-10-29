import type { ReactNode } from 'react';
import type { ComponentKind } from '@/demo/scene/sceneComponents';
import { ComponentHeader } from '@/ui/componentHeader/ComponentHeader';
import { PropertyRowGroup } from '@/ui/propertyRow/PropertyRowGroup';
import { useComponentMenu } from './useComponentMenu';

export interface ComponentSectionProps {
  readonly component: ComponentKind;
  readonly title: string;
  readonly expanded: boolean;
  readonly onExpandedChange: (expanded: boolean) => void;
  readonly children: ReactNode;
}

export function ComponentSection({
  component,
  title,
  expanded,
  onExpandedChange,
  children,
}: ComponentSectionProps) {
  const menu = useComponentMenu(component, title);

  return (
    <ComponentHeader
      title={title}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      {...menu}
    >
      <PropertyRowGroup>{children}</PropertyRowGroup>
    </ComponentHeader>
  );
}
