import { PageSection } from '@/showcase/template/PageSection';
import { TokenSection } from '@/showcase/tokens/TokenSection';
import { getSizeTokenNames } from '@/showcase/tokens/tokenNames';

export function SizesPage() {
  return (
    <>
      <PageSection title="Controls">
        <p>
          Heights of buttons, fields and other controls. <code>md</code> is the default,{' '}
          <code>sm</code> fits dense lists and toolbars, <code>lg</code> is for roomy rows.
        </p>
        <TokenSection group="size" names={getSizeTokenNames('control')} />
      </PageSection>
      <PageSection title="Panels">
        <p>Heights of the main menu bar, the toolbar, panel tabs and the status bar.</p>
        <TokenSection group="size" names={getSizeTokenNames('panel')} />
      </PageSection>
      <PageSection title="Icons">
        <p>Icon sizes. Icons are square.</p>
        <TokenSection group="size" names={getSizeTokenNames('icon')} />
      </PageSection>
      <PageSection title="Borders">
        <p>Width of borders, separators and the focus outline.</p>
        <TokenSection group="size" names={getSizeTokenNames('border')} />
      </PageSection>
      <PageSection title="Scrollbar">
        <p>Thickness of scrollbars.</p>
        <TokenSection group="size" names={getSizeTokenNames('scrollbar')} />
      </PageSection>
      <PageSection title="Property rows">
        <p>
          Limits of the label column in property rows: the narrowest label and the narrowest field
          when the column is dragged, and the width of the grip on the column border.
        </p>
        <TokenSection group="size" names={getSizeTokenNames('property')} />
      </PageSection>
      <PageSection title="Lists and trees">
        <p>
          Height of a row in lists and trees and the indent of one tree level. Every row has the
          same height, so a long list draws only the rows in view.
        </p>
        <TokenSection group="size" names={getSizeTokenNames('list')} />
      </PageSection>
    </>
  );
}
