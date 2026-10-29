import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { PageSection } from '@/showcase/template/PageSection';
import { TokenSection } from '@/showcase/tokens/TokenSection';
import { GROUPED_TOKEN_NAMES } from '@/showcase/tokens/tokenNames';
import { layersAndMotionPageMessages } from './layersAndMotionPageMessages';

export function LayersAndMotionPage() {
  const doc = useDocMessages(layersAndMotionPageMessages);

  return (
    <>
      <PageSection title={doc('layersTitle')}>
        <p>{doc('layersText')}</p>
        <TokenSection group="z" names={GROUPED_TOKEN_NAMES.z} />
      </PageSection>
      <PageSection title={doc('durationsTitle')}>
        <p>{doc('durationsText')}</p>
        <TokenSection group="duration" names={GROUPED_TOKEN_NAMES.duration} />
      </PageSection>
      <PageSection title={doc('easingTitle')}>
        <p>{doc('easingText')}</p>
        <TokenSection group="easing" names={GROUPED_TOKEN_NAMES.easing} />
      </PageSection>
    </>
  );
}
