import { PageSection } from '@/showcase/template/PageSection';
import { TokenSection } from '@/showcase/tokens/TokenSection';
import { GROUPED_TOKEN_NAMES } from '@/showcase/tokens/tokenNames';

export function ColorsPage() {
  return (
    <>
      <PageSection title="Roles">
        <p>Color tokens are named by role. Pick a token by what the element is, not by its look.</p>
        <ul>
          <li>
            <code>bg-*</code> are surfaces: app, panels, headers, fields, controls, popups and
            selection.
          </li>
          <li>
            <code>text-*</code> are text colors. Every text uses one of them.
          </li>
          <li>
            <code>border-*</code> are separators, control borders and the focus outline.
          </li>
          <li>
            <code>accent</code>, <code>accent-hover</code> and <code>accent-active</code> mark the
            primary action in its normal, hovered and pressed states, with{' '}
            <code>text-on-accent</code> on top.
          </li>
          <li>
            <code>status-*</code> are for icons, borders and indicators only, never for text.
          </li>
          <li>
            <code>overlay-*</code> are translucent layers for hover and pressed states.
          </li>
          <li>
            <code>axis-*</code>, <code>playmode-tint</code>, <code>scrollbar-*</code> and{' '}
            <code>shadow</code> serve their specific editor elements.
          </li>
        </ul>
      </PageSection>
      <PageSection title="Tokens">
        <p>Values are shown for the current theme.</p>
        <TokenSection group="color" names={GROUPED_TOKEN_NAMES.color} />
      </PageSection>
    </>
  );
}
