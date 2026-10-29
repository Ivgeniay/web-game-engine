import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { PageSection } from '@/showcase/template/PageSection';
import { TokenSection } from '@/showcase/tokens/TokenSection';
import { GROUPED_TOKEN_NAMES } from '@/showcase/tokens/tokenNames';
import { spacingPageMessages } from './spacingPageMessages';

export function SpacingPage() {
  const doc = useDocMessages(spacingPageMessages);

  return (
    <>
      <PageSection title={doc('usageTitle')}>
        <p>{doc('usageText')}</p>
      </PageSection>
      <PageSection title={doc('tokensTitle')}>
        <TokenSection group="space" names={GROUPED_TOKEN_NAMES.space} />
      </PageSection>
    </>
  );
}
