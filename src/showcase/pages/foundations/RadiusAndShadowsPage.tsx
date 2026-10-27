import { PageSection } from '@/showcase/template/PageSection';
import { TokenSection } from '@/showcase/tokens/TokenSection';
import { GROUPED_TOKEN_NAMES } from '@/showcase/tokens/tokenNames';

export function RadiusAndShadowsPage() {
  return (
    <>
      <PageSection title="Radius">
        <p>
          Corner radii. Editor surfaces are mostly sharp or slightly rounded,{' '}
          <code>radius-full</code> is for pills and round indicators.
        </p>
        <TokenSection group="radius" names={GROUPED_TOKEN_NAMES.radius} />
      </PageSection>
      <PageSection title="Shadows">
        <p>
          Shadows separate floating elements from the content below: popups, menus and tooltips.
          Docked panels have no shadow.
        </p>
        <TokenSection group="shadow" names={GROUPED_TOKEN_NAMES.shadow} />
      </PageSection>
    </>
  );
}
