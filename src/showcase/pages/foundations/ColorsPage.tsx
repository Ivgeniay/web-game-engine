import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { PageSection } from '@/showcase/template/PageSection';
import { TokenSection } from '@/showcase/tokens/TokenSection';
import { GROUPED_TOKEN_NAMES } from '@/showcase/tokens/tokenNames';
import { colorsPageMessages } from './colorsPageMessages';

export function ColorsPage() {
  const doc = useDocMessages(colorsPageMessages);

  return (
    <>
      <PageSection title={doc('rolesTitle')}>
        <p>{doc('rolesIntro')}</p>
        <ul>
          <li>{doc('rolesBackground')}</li>
          <li>{doc('rolesText')}</li>
          <li>{doc('rolesBorder')}</li>
          <li>{doc('rolesAccent')}</li>
          <li>{doc('rolesStatus')}</li>
          <li>{doc('rolesOverlay')}</li>
          <li>{doc('rolesSpecific')}</li>
        </ul>
      </PageSection>
      <PageSection title={doc('tokensTitle')}>
        <p>{doc('tokensText')}</p>
        <TokenSection group="color" names={GROUPED_TOKEN_NAMES.color} />
      </PageSection>
    </>
  );
}
