import { messageRef } from '@/core/i18n/translate';
import { demoMessages } from '@/demo/demoMessages';
import type { SceneObject, Transform } from '@/demo/scene/sceneStore';
import { useMessages } from '@/state/language/useMessages';
import { ComponentSection } from './ComponentSection';
import { VectorPropertyRow } from './VectorPropertyRow';

type TransformKey = keyof Transform;

const TRANSFORM_KEYS: readonly TransformKey[] = ['position', 'rotation', 'scale'];
const ROTATION_STEP = 1;

interface TransformSectionProps {
  readonly objects: readonly SceneObject[];
  readonly expanded: boolean;
  readonly onExpandedChange: (expanded: boolean) => void;
}

export function TransformSection({ objects, expanded, onExpandedChange }: TransformSectionProps) {
  const t = useMessages(demoMessages);

  return (
    <ComponentSection
      component="transform"
      title={t('transform')}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
    >
      {TRANSFORM_KEYS.map((property) => (
        <VectorPropertyRow
          key={property}
          objects={objects}
          label={t(property)}
          undoLabel={messageRef(demoMessages, property)}
          step={property === 'rotation' ? ROTATION_STEP : undefined}
          get={(object) => object.transform[property]}
          set={(object, value) => ({
            ...object,
            transform: { ...object.transform, [property]: value },
          })}
        />
      ))}
    </ComponentSection>
  );
}
