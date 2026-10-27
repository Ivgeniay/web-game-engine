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
    </>
  );
}
