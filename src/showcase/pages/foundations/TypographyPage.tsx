import { PageSection } from '@/showcase/template/PageSection';
import { TokenSection } from '@/showcase/tokens/TokenSection';
import { GROUPED_TOKEN_NAMES } from '@/showcase/tokens/tokenNames';

export function TypographyPage() {
  return (
    <>
      <PageSection title="Usage">
        <ul>
          <li>
            <code>font-family-ui</code> is for interface text, <code>font-family-mono</code> for
            code, values and identifiers.
          </li>
          <li>
            <code>font-size-md</code> is the base interface size. Smaller sizes are for secondary
            details, larger ones for headings.
          </li>
          <li>
            <code>font-line-height-compact</code> fits single-line controls,{' '}
            <code>font-line-height-multiline</code> is for paragraphs and code.
          </li>
        </ul>
      </PageSection>
      <PageSection title="Tokens">
        <TokenSection group="font" names={GROUPED_TOKEN_NAMES.font} />
      </PageSection>
    </>
  );
}
