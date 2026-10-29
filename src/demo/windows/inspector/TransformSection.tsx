import { messageRef } from '@/core/i18n/translate';
import { demoMessages } from '@/demo/demoMessages';
import type { SceneObject, Transform } from '@/demo/scene/sceneStore';
import { useNumberFieldMessages } from '@/state/fields/useNumberFieldMessages';
import { useMessages } from '@/state/language/useMessages';
import { Label } from '@/ui/label/Label';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { PropertyRowGroup } from '@/ui/propertyRow/PropertyRowGroup';
import { VECTOR3_AXES } from '@/ui/vectorField/vectorAxes';
import { VectorField } from '@/ui/vectorField/VectorField';
import styles from './Inspector.module.css';
import { useObjectProperty } from './useObjectProperty';

type TransformKey = keyof Transform;

const ROTATION_STEP = 1;

interface TransformRowProps {
  readonly object: SceneObject;
  readonly property: TransformKey;
  readonly step?: number | undefined;
}

function TransformRow({ object, property, step }: TransformRowProps) {
  const t = useMessages(demoMessages);
  const invalidMessages = useNumberFieldMessages();
  const onValueChange = useObjectProperty({
    object,
    label: messageRef(demoMessages, property),
    get: (current) => current.transform[property],
    set: (current, value) => ({
      ...current,
      transform: { ...current.transform, [property]: value },
    }),
  });

  return (
    <PropertyRow label={t(property)}>
      {({ id, labelId }) => (
        <VectorField
          id={id}
          aria-labelledby={labelId}
          axes={VECTOR3_AXES}
          value={object.transform[property]}
          step={step}
          invalidMessages={invalidMessages}
          onValueChange={onValueChange}
        />
      )}
    </PropertyRow>
  );
}

interface TransformSectionProps {
  readonly object: SceneObject;
}

export function TransformSection({ object }: TransformSectionProps) {
  const t = useMessages(demoMessages);

  return (
    <section className={styles.section}>
      <Label tone="secondary">{t('transform')}</Label>
      <PropertyRowGroup>
        <TransformRow object={object} property="position" />
        <TransformRow object={object} property="rotation" step={ROTATION_STEP} />
        <TransformRow object={object} property="scale" />
      </PropertyRowGroup>
    </section>
  );
}
