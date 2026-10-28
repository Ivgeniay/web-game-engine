import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { ClippedContainerExample } from './ClippedContainerExample';
import clippedContainerStyles from './ClippedContainerExample.module.css?raw';
import clippedContainerSource from './ClippedContainerExample.tsx?raw';

export function PopupLayerPage() {
  return (
    <>
      <PageSection title="One layer for every popup">
        <p>
          Tooltips, menus, lists, popovers and dialogs are rendered into one layer at the end of the
          document, the <code>#popup-layer</code> element, not next to the control that opens them.
          A panel with <code>overflow: hidden</code> or its own stacking order cannot clip or cover
          them. Theme tokens are declared on the root element, so popups follow the theme like the
          rest of the editor.
        </p>
        <p>
          The button in the example sits at the edge of a panel that clips its content. Hover it:
          the tooltip leaves the panel and moves away from the edge of the screen.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'ClippedContainerExample.tsx', code: clippedContainerSource },
            { fileName: 'ClippedContainerExample.module.css', code: clippedContainerStyles },
          ]}
        >
          <ClippedContainerExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Connecting the layer">
        <p>
          Wrap the app in <code>PopupLayer</code> from <code>@/ui/popup/PopupLayer</code> once, in
          the entry point, inside <code>StoresProvider</code>. The editor and the showcase already
          do this. The layer groups tooltips, so the hints of neighbouring controls appear without
          the delay. Without it every popup still works, only that grouping is lost.
        </p>
      </PageSection>
      <PageSection title="Stacking and position">
        <p>
          Every kind of popup takes its z-index from a token: <code>--z-modal</code> for dialogs,{' '}
          <code>--z-dropdown</code> for menus, lists and popovers, <code>--z-tooltip</code> for
          tooltips. Since all popups share one layer, the token order alone decides what is on top,
          so a list or a tooltip opened inside a dialog appears above it.
        </p>
        <p>
          A popup keeps a gap of <code>--space-4</code> from its anchor and of{' '}
          <code>--space-8</code> from the edges of the screen. Near an edge it flips to the other
          side of the anchor and shifts along it; lists and popovers shrink their height to fit.
          When the anchor is scrolled out of view, the popup hides.
        </p>
      </PageSection>
    </>
  );
}
