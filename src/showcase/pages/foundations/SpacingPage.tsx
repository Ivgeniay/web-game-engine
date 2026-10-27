import { PageSection } from '@/showcase/template/PageSection';
import { TokenSection } from '@/showcase/tokens/TokenSection';
import { GROUPED_TOKEN_NAMES } from '@/showcase/tokens/tokenNames';

export function SpacingPage() {
  return (
    <>
      <PageSection title="Usage">
        <p>
          Paddings, margins and gaps use the spacing scale. The token name is its size in pixels, so
          a value that is not on the scale is a sign to pick the nearest step instead.
        </p>
      </PageSection>
      <PageSection title="Tokens">
        <TokenSection group="space" names={GROUPED_TOKEN_NAMES.space} />
      </PageSection>
    </>
  );
}
