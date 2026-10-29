import type { MessageRef } from '@/core/i18n/translate';
import { demoMessages } from '@/demo/demoMessages';
import type { SceneObject } from '@/demo/scene/sceneStore';
import { useMessages } from '@/state/language/useMessages';
import { ComponentHeader } from '@/ui/componentHeader/ComponentHeader';
import { PropertyRowGroup } from '@/ui/propertyRow/PropertyRowGroup';
import type { ComponentSectionProps } from './ComponentSection';
import { useComponentMenu } from './useComponentMenu';
import { useSelectionProperty } from './useSelectionProperty';

export interface ComponentEnabled {
  readonly undoLabel: MessageRef;
  readonly get: (object: SceneObject) => boolean;
  readonly set: (object: SceneObject, enabled: boolean) => SceneObject;
}

interface ToggleableComponentSectionProps extends ComponentSectionProps {
  readonly objects: readonly SceneObject[];
  readonly enabled: ComponentEnabled;
}

export function ToggleableComponentSection({
  component,
  title,
  objects,
  expanded,
  onExpandedChange,
  enabled,
  children,
}: ToggleableComponentSectionProps) {
  const t = useMessages(demoMessages);
  const menu = useComponentMenu(component, title);
  const toggle = useSelectionProperty({
    objects,
    label: enabled.undoLabel,
    get: enabled.get,
    set: enabled.set,
  });

  return (
    <ComponentHeader
      title={title}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      enabled={toggle.mixed ? 'mixed' : toggle.value}
      enabledLabel={t('enableComponent', { component: title })}
      onEnabledChange={(next) => {
        toggle.onValueChange(next, 'commit');
      }}
      {...menu}
    >
      <PropertyRowGroup>{children}</PropertyRowGroup>
    </ComponentHeader>
  );
}
