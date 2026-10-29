import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { PageSection } from '@/showcase/template/PageSection';
import { TokenSection } from '@/showcase/tokens/TokenSection';
import { GROUPED_TOKEN_NAMES } from '@/showcase/tokens/tokenNames';
import { radiusAndShadowsPageMessages } from './radiusAndShadowsPageMessages';

export function RadiusAndShadowsPage() {
  const doc = useDocMessages(radiusAndShadowsPageMessages);

  return (
    <>
      <PageSection title={doc('radiusTitle')}>
        <p>{doc('radiusText')}</p>
        <TokenSection group="radius" names={GROUPED_TOKEN_NAMES.radius} />
      </PageSection>
      <PageSection title={doc('shadowsTitle')}>
        <p>{doc('shadowsText')}</p>
        <TokenSection group="shadow" names={GROUPED_TOKEN_NAMES.shadow} />
      </PageSection>
    </>
  );
}
