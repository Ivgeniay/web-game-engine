import { messageRef } from '@/core/i18n/translate';
import { demoMessages } from '@/demo/demoMessages';
import type { Interpolation, Rigidbody, SceneObject } from '@/demo/scene/sceneStore';
import { useNumberFieldMessages } from '@/state/fields/useNumberFieldMessages';
import { useMessages } from '@/state/language/useMessages';
import { Checkbox } from '@/ui/checkbox/Checkbox';
import { Label } from '@/ui/label/Label';
import { NumberField } from '@/ui/numberField/NumberField';
import { PropertyRow } from '@/ui/propertyRow/PropertyRow';
import { PropertyRowGroup } from '@/ui/propertyRow/PropertyRowGroup';
import { Select } from '@/ui/select/Select';
import styles from './Inspector.module.css';
import { useObjectProperty } from './useObjectProperty';

const MIN_MASS = 0;
const MIN_DRAG = 0;

interface RigidbodySectionProps {
  readonly object: SceneObject;
  readonly rigidbody: Rigidbody;
}

function withRigidbody(object: SceneObject, patch: Partial<Rigidbody>): SceneObject {
  return object.rigidbody === null
    ? object
    : { ...object, rigidbody: { ...object.rigidbody, ...patch } };
}

export function RigidbodySection({ object, rigidbody }: RigidbodySectionProps) {
  const t = useMessages(demoMessages);
  const massMessages = useNumberFieldMessages({ min: MIN_MASS });
  const dragMessages = useNumberFieldMessages({ min: MIN_DRAG });
  const changeMass = useObjectProperty({
    object,
    label: messageRef(demoMessages, 'mass'),
    get: (current) => current.rigidbody?.mass ?? rigidbody.mass,
    set: (current, mass: number) => withRigidbody(current, { mass }),
  });
  const changeDrag = useObjectProperty({
    object,
    label: messageRef(demoMessages, 'drag'),
    get: (current) => current.rigidbody?.drag ?? rigidbody.drag,
    set: (current, drag: number) => withRigidbody(current, { drag }),
  });
  const changeGravity = useObjectProperty({
    object,
    label: messageRef(demoMessages, 'useGravity'),
    get: (current) => current.rigidbody?.useGravity ?? rigidbody.useGravity,
    set: (current, useGravity: boolean) => withRigidbody(current, { useGravity }),
  });
  const changeInterpolation = useObjectProperty({
    object,
    label: messageRef(demoMessages, 'interpolate'),
    get: (current) => current.rigidbody?.interpolate ?? rigidbody.interpolate,
    set: (current, interpolate: Interpolation) => withRigidbody(current, { interpolate }),
  });

  return (
    <section className={styles.section}>
      <Label tone="secondary">{t('rigidbody')}</Label>
      <PropertyRowGroup>
        <PropertyRow
          label={t('mass')}
          drag={{ value: rigidbody.mass, onValueChange: changeMass, min: MIN_MASS }}
        >
          {({ id }) => (
            <NumberField
              id={id}
              value={rigidbody.mass}
              min={MIN_MASS}
              invalidMessages={massMessages}
              onValueChange={changeMass}
            />
          )}
        </PropertyRow>
        <PropertyRow
          label={t('drag')}
          drag={{ value: rigidbody.drag, onValueChange: changeDrag, min: MIN_DRAG }}
        >
          {({ id }) => (
            <NumberField
              id={id}
              value={rigidbody.drag}
              min={MIN_DRAG}
              invalidMessages={dragMessages}
              onValueChange={changeDrag}
            />
          )}
        </PropertyRow>
        <PropertyRow label={t('useGravity')}>
          {({ id, labelId }) => (
            <Checkbox
              id={id}
              aria-labelledby={labelId}
              checked={rigidbody.useGravity}
              onCheckedChange={(checked) => {
                changeGravity(checked, 'commit');
              }}
            />
          )}
        </PropertyRow>
        <PropertyRow label={t('interpolate')}>
          {({ id, labelId }) => (
            <Select
              id={id}
              aria-labelledby={labelId}
              options={[
                { kind: 'option', value: 'none', label: t('interpolationNone') },
                { kind: 'option', value: 'interpolate', label: t('interpolationInterpolate') },
                { kind: 'option', value: 'extrapolate', label: t('interpolationExtrapolate') },
              ]}
              value={rigidbody.interpolate}
              onValueChange={(value) => {
                changeInterpolation(value, 'commit');
              }}
            />
          )}
        </PropertyRow>
      </PropertyRowGroup>
    </section>
  );
}
