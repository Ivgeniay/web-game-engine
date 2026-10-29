import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { PageSection } from '@/showcase/template/PageSection';
import { TokenSection } from '@/showcase/tokens/TokenSection';
import { GROUPED_TOKEN_NAMES } from '@/showcase/tokens/tokenNames';
import { typographyPageMessages } from './typographyPageMessages';

export function TypographyPage() {
  const doc = useDocMessages(typographyPageMessages);

  return (
    <>
      <PageSection title={doc('usageTitle')}>
        <ul>
          <li>{doc('usageFamily')}</li>
          <li>{doc('usageSize')}</li>
          <li>{doc('usageLineHeight')}</li>
        </ul>
      </PageSection>
      <PageSection title={doc('tokensTitle')}>
        <TokenSection group="font" names={GROUPED_TOKEN_NAMES.font} />
      </PageSection>
    </>
  );
}
