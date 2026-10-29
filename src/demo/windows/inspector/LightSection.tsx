import { messageRef } from '@/core/i18n/translate';
import { demoMessages } from '@/demo/demoMessages';
import type { Light, LightType, SceneObject } from '@/demo/scene/sceneStore';
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

const MIN_INTENSITY = 0;
const MIN_RANGE = 0;

interface LightSectionProps {
  readonly object: SceneObject;
  readonly light: Light;
}

function withLight(object: SceneObject, patch: Partial<Light>): SceneObject {
  return object.light === null ? object : { ...object, light: { ...object.light, ...patch } };
}

export function LightSection({ object, light }: LightSectionProps) {
  const t = useMessages(demoMessages);
  const intensityMessages = useNumberFieldMessages({ min: MIN_INTENSITY });
  const rangeMessages = useNumberFieldMessages({ min: MIN_RANGE });
  const changeType = useObjectProperty({
    object,
    label: messageRef(demoMessages, 'lightType'),
    get: (current) => current.light?.type ?? light.type,
    set: (current, type: LightType) => withLight(current, { type }),
  });
  const changeIntensity = useObjectProperty({
    object,
    label: messageRef(demoMessages, 'intensity'),
    get: (current) => current.light?.intensity ?? light.intensity,
    set: (current, intensity: number) => withLight(current, { intensity }),
  });
  const changeRange = useObjectProperty({
    object,
    label: messageRef(demoMessages, 'range'),
    get: (current) => current.light?.range ?? light.range,
    set: (current, range: number) => withLight(current, { range }),
  });
  const changeShadows = useObjectProperty({
    object,
    label: messageRef(demoMessages, 'castShadows'),
    get: (current) => current.light?.castShadows ?? light.castShadows,
    set: (current, castShadows: boolean) => withLight(current, { castShadows }),
  });

  return (
    <section className={styles.section}>
      <Label tone="secondary">{t('light')}</Label>
      <PropertyRowGroup>
        <PropertyRow label={t('lightType')}>
          {({ id, labelId }) => (
            <Select
              id={id}
              aria-labelledby={labelId}
              options={[
                { kind: 'option', value: 'directional', label: t('lightDirectional') },
                { kind: 'option', value: 'point', label: t('lightPoint') },
                { kind: 'option', value: 'spot', label: t('lightSpot') },
              ]}
              value={light.type}
              onValueChange={(value) => {
                changeType(value, 'commit');
              }}
            />
          )}
        </PropertyRow>
        <PropertyRow
          label={t('intensity')}
          drag={{ value: light.intensity, onValueChange: changeIntensity, min: MIN_INTENSITY }}
        >
          {({ id }) => (
            <NumberField
              id={id}
              value={light.intensity}
              min={MIN_INTENSITY}
              invalidMessages={intensityMessages}
              onValueChange={changeIntensity}
            />
          )}
        </PropertyRow>
        <PropertyRow
          label={t('range')}
          drag={{ value: light.range, onValueChange: changeRange, min: MIN_RANGE }}
        >
          {({ id }) => (
            <NumberField
              id={id}
              value={light.range}
              min={MIN_RANGE}
              invalidMessages={rangeMessages}
              onValueChange={changeRange}
            />
          )}
        </PropertyRow>
        <PropertyRow label={t('castShadows')}>
          {({ id, labelId }) => (
            <Checkbox
              id={id}
              aria-labelledby={labelId}
              checked={light.castShadows}
              onCheckedChange={(checked) => {
                changeShadows(checked, 'commit');
              }}
            />
          )}
        </PropertyRow>
      </PropertyRowGroup>
    </section>
  );
}
