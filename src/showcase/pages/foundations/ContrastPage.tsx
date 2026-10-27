import { PageSection } from '@/showcase/template/PageSection';
import { ContrastSection } from '@/showcase/tokens/ContrastSection';

export function ContrastPage() {
  return (
    <>
      <PageSection title="Thresholds">
        <p>
          Color pairs that appear in the interface are checked against WCAG contrast thresholds: 4.5
          for text, 3 for indicators and borders. The pairs are listed in{' '}
          <code>src/themes/contrastPairs.ts</code>, and <code>src/themes/themes.test.ts</code> fails
          when a pair in either theme drops below its threshold.
        </p>
        <p>
          When a component puts a new color combination on screen, add the pair to the list so the
          test covers it.
        </p>
      </PageSection>
      <PageSection title="Pairs">
        <p>Ratios are shown for the current theme.</p>
        <ContrastSection />
      </PageSection>
    </>
  );
}
