import { messageRef } from '@/core/i18n/translate';
import { demoMessages } from '@/demo/demoMessages';
import { DEFAULT_LIGHT } from '@/demo/scene/sceneStore';
import type { Light, LightType, SceneObject } from '@/demo/scene/sceneStore';
import { useMessages } from '@/state/language/useMessages';
import { BooleanPropertyRow } from './BooleanPropertyRow';
import { ChoicePropertyRow } from './ChoicePropertyRow';
import { NumberPropertyRow } from './NumberPropertyRow';
import { ToggleableComponentSection } from './ToggleableComponentSection';

const MIN_INTENSITY = 0;
const MIN_RANGE = 0;

interface LightSectionProps {
  readonly objects: readonly SceneObject[];
  readonly expanded: boolean;
  readonly onExpandedChange: (expanded: boolean) => void;
}

function lightOf(object: SceneObject): Light {
  return object.light ?? DEFAULT_LIGHT;
}

function withLight(object: SceneObject, patch: Partial<Light>): SceneObject {
  return object.light === null ? object : { ...object, light: { ...object.light, ...patch } };
}

export function LightSection({ objects, expanded, onExpandedChange }: LightSectionProps) {
  const t = useMessages(demoMessages);

  return (
    <ToggleableComponentSection
      component="light"
      title={t('light')}
      objects={objects}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      enabled={{
        undoLabel: messageRef(demoMessages, 'light'),
        get: (object) => lightOf(object).enabled,
        set: (object, enabled) => withLight(object, { enabled }),
      }}
    >
      <ChoicePropertyRow<LightType>
        objects={objects}
        label={t('lightType')}
        undoLabel={messageRef(demoMessages, 'lightType')}
        options={[
          { kind: 'option', value: 'directional', label: t('lightDirectional') },
          { kind: 'option', value: 'point', label: t('lightPoint') },
          { kind: 'option', value: 'spot', label: t('lightSpot') },
        ]}
        get={(object) => lightOf(object).type}
        set={(object, type) => withLight(object, { type })}
      />
      <NumberPropertyRow
        objects={objects}
        label={t('intensity')}
        undoLabel={messageRef(demoMessages, 'intensity')}
        min={MIN_INTENSITY}
        get={(object) => lightOf(object).intensity}
        set={(object, intensity) => withLight(object, { intensity })}
      />
      <NumberPropertyRow
        objects={objects}
        label={t('range')}
        undoLabel={messageRef(demoMessages, 'range')}
        min={MIN_RANGE}
        get={(object) => lightOf(object).range}
        set={(object, range) => withLight(object, { range })}
      />
      <BooleanPropertyRow
        objects={objects}
        label={t('castShadows')}
        undoLabel={messageRef(demoMessages, 'castShadows')}
        get={(object) => lightOf(object).castShadows}
        set={(object, castShadows) => withLight(object, { castShadows })}
      />
    </ToggleableComponentSection>
  );
}
