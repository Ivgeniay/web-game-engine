import { messageRef } from '@/core/i18n/translate';
import { demoMessages } from '@/demo/demoMessages';
import { DEFAULT_RIGIDBODY, RIGIDBODY_CONSTRAINTS } from '@/demo/scene/sceneStore';
import type {
  Interpolation,
  Rigidbody,
  RigidbodyConstraint,
  SceneObject,
} from '@/demo/scene/sceneStore';
import { useMessages } from '@/state/language/useMessages';
import { BooleanPropertyRow } from './BooleanPropertyRow';
import { ChoicePropertyRow } from './ChoicePropertyRow';
import { FlagsPropertyRow } from './FlagsPropertyRow';
import { NumberPropertyRow } from './NumberPropertyRow';
import { ToggleableComponentSection } from './ToggleableComponentSection';

const MIN_MASS = 0;
const MIN_DRAG = 0;

interface RigidbodySectionProps {
  readonly objects: readonly SceneObject[];
  readonly expanded: boolean;
  readonly onExpandedChange: (expanded: boolean) => void;
}

function rigidbodyOf(object: SceneObject): Rigidbody {
  return object.rigidbody ?? DEFAULT_RIGIDBODY;
}

function withRigidbody(object: SceneObject, patch: Partial<Rigidbody>): SceneObject {
  return object.rigidbody === null
    ? object
    : { ...object, rigidbody: { ...object.rigidbody, ...patch } };
}

export function RigidbodySection({ objects, expanded, onExpandedChange }: RigidbodySectionProps) {
  const t = useMessages(demoMessages);

  return (
    <ToggleableComponentSection
      component="rigidbody"
      title={t('rigidbody')}
      objects={objects}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      enabled={{
        undoLabel: messageRef(demoMessages, 'rigidbody'),
        get: (object) => rigidbodyOf(object).enabled,
        set: (object, enabled) => withRigidbody(object, { enabled }),
      }}
    >
      <NumberPropertyRow
        objects={objects}
        label={t('mass')}
        undoLabel={messageRef(demoMessages, 'mass')}
        min={MIN_MASS}
        get={(object) => rigidbodyOf(object).mass}
        set={(object, mass) => withRigidbody(object, { mass })}
      />
      <NumberPropertyRow
        objects={objects}
        label={t('drag')}
        undoLabel={messageRef(demoMessages, 'drag')}
        min={MIN_DRAG}
        get={(object) => rigidbodyOf(object).drag}
        set={(object, drag) => withRigidbody(object, { drag })}
      />
      <BooleanPropertyRow
        objects={objects}
        label={t('useGravity')}
        undoLabel={messageRef(demoMessages, 'useGravity')}
        get={(object) => rigidbodyOf(object).useGravity}
        set={(object, useGravity) => withRigidbody(object, { useGravity })}
      />
      <ChoicePropertyRow<Interpolation>
        objects={objects}
        label={t('interpolate')}
        undoLabel={messageRef(demoMessages, 'interpolate')}
        options={[
          { kind: 'option', value: 'none', label: t('interpolationNone') },
          { kind: 'option', value: 'interpolate', label: t('interpolationInterpolate') },
          { kind: 'option', value: 'extrapolate', label: t('interpolationExtrapolate') },
        ]}
        get={(object) => rigidbodyOf(object).interpolate}
        set={(object, interpolate) => withRigidbody(object, { interpolate })}
      />
      <FlagsPropertyRow<RigidbodyConstraint>
        objects={objects}
        label={t('constraints')}
        undoLabel={messageRef(demoMessages, 'constraints')}
        options={RIGIDBODY_CONSTRAINTS.map((constraint) => ({
          value: constraint,
          label: t(constraint),
        }))}
        get={(object) => rigidbodyOf(object).constraints}
        set={(object, constraints) => withRigidbody(object, { constraints })}
      />
    </ToggleableComponentSection>
  );
}
