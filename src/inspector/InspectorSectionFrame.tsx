import { useMemo } from 'react';
import type { ReactNode } from 'react';
import type { InspectorSectionProps } from '@/contracts/inspector';
import type { PropertyAccess } from '@/contracts/property';
import { samePropertyValue } from '@/core/inspector/propertyValue';
import { useContextMenuItems } from '@/shell/useContextMenuItems';
import { useMessages } from '@/state/language/useMessages';
import { useTranslate } from '@/state/language/useTranslate';
import { ComponentHeader } from '@/ui/componentHeader/ComponentHeader';
import type { CheckboxChecked } from '@/ui/checkbox/Checkbox';
import { PropertyRowGroup } from '@/ui/propertyRow/PropertyRowGroup';
import { inspectorSectionMenu } from './inspectorMenus';
import { inspectorMessages } from './inspectorMessages';
import { useTargetsValue } from './useTargetsValue';

interface InspectorSectionFrameProps extends InspectorSectionProps {
  readonly children: ReactNode;
}

interface SectionHeaderContentProps extends InspectorSectionFrameProps {
  readonly title: string;
  readonly enabled?: SectionToggle | undefined;
}

interface SectionToggle {
  readonly checked: CheckboxChecked;
  readonly onChange: (enabled: boolean) => void;
}

interface ToggleableSectionProps extends InspectorSectionFrameProps {
  readonly title: string;
  readonly access: PropertyAccess<boolean>;
}

function SectionHeaderContent({
  section,
  targetIds,
  expanded,
  onExpandedChange,
  title,
  enabled,
  children,
}: SectionHeaderContentProps) {
  const t = useMessages(inspectorMessages);
  const target = useMemo(() => ({ section, targetIds }), [section, targetIds]);
  const menuItems = useContextMenuItems(inspectorSectionMenu, target);
  const menu =
    menuItems.length > 0 ? { menuItems, menuLabel: t('sectionMenu', { section: title }) } : {};
  const toggle =
    enabled === undefined
      ? {}
      : {
          enabled: enabled.checked,
          onEnabledChange: enabled.onChange,
          enabledLabel: t('enableSection', { section: title }),
        };

  return (
    <ComponentHeader
      title={title}
      icon={section.icon}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      {...toggle}
      {...menu}
    >
      <PropertyRowGroup>{children}</PropertyRowGroup>
    </ComponentHeader>
  );
}

function ToggleableSection({ access, ...props }: ToggleableSectionProps) {
  const binding = useTargetsValue({
    access,
    targetIds: props.targetIds,
    label: props.section.title,
    equals: samePropertyValue,
  });
  const enabled =
    binding === null
      ? undefined
      : {
          checked: binding.mixed ? ('mixed' as const) : binding.value,
          onChange: (next: boolean) => {
            binding.onValueChange(next, 'commit');
          },
        };

  return <SectionHeaderContent {...props} enabled={enabled} />;
}

export function InspectorSectionFrame(props: InspectorSectionFrameProps) {
  const translate = useTranslate();
  const title = translate(props.section.title);
  const { enabled } = props.section;

  return enabled === undefined ? (
    <SectionHeaderContent {...props} title={title} />
  ) : (
    <ToggleableSection {...props} title={title} access={enabled} />
  );
}
