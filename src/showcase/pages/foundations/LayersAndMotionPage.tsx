import { PageSection } from '@/showcase/template/PageSection';
import { TokenSection } from '@/showcase/tokens/TokenSection';
import { GROUPED_TOKEN_NAMES } from '@/showcase/tokens/tokenNames';

export function LayersAndMotionPage() {
  return (
    <>
      <PageSection title="Layers">
        <p>
          Stacking order of editor layers, from the base content up to tooltips. Use these tokens
          instead of z-index numbers so layers never fight each other.
        </p>
        <TokenSection group="z" names={GROUPED_TOKEN_NAMES.z} />
      </PageSection>
      <PageSection title="Durations">
        <p>
          Transition durations. When the user asks for reduced motion, they become <code>0ms</code>,
          so transitions built on them turn off on their own.
        </p>
        <TokenSection group="duration" names={GROUPED_TOKEN_NAMES.duration} />
      </PageSection>
      <PageSection title="Easing">
        <p>Timing curves for transitions.</p>
        <TokenSection group="easing" names={GROUPED_TOKEN_NAMES.easing} />
      </PageSection>
    </>
  );
}
