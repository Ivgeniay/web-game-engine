import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { ToggleButtonDisabledExample } from './ToggleButtonDisabledExample';
import toggleButtonDisabledStyles from './ToggleButtonDisabledExample.module.css?raw';
import toggleButtonDisabledSource from './ToggleButtonDisabledExample.tsx?raw';
import { ToggleButtonExample } from './ToggleButtonExample';
import toggleButtonStyles from './ToggleButtonExample.module.css?raw';
import toggleButtonSource from './ToggleButtonExample.tsx?raw';
import { ToggleButtonIconExample } from './ToggleButtonIconExample';
import toggleButtonIconStyles from './ToggleButtonIconExample.module.css?raw';
import toggleButtonIconSource from './ToggleButtonIconExample.tsx?raw';

export function ToggleButtonPage() {
  return (
    <>
      <PageSection title="Pressed state">
        <p>
          A toggle button is on or off. The state is controlled: <code>pressed</code> sets it, and{' '}
          <code>onPressedChange</code> receives the requested new state when the button is clicked
          or pressed with Enter or Space. The pressed state is shown with the selection background,
          not only with a color of the text, and screen readers get it from{' '}
          <code>aria-pressed</code>.
        </p>
        <p>
          <code>variant</code> is <code>default</code> or <code>flat</code>; there is no accent
          toggle. <code>size</code> works as for <code>Button</code>.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'ToggleButtonExample.tsx', code: toggleButtonSource },
            { fileName: 'ToggleButtonExample.module.css', code: toggleButtonStyles },
          ]}
        >
          <ToggleButtonExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Icon only">
        <p>
          Without text, pass <code>icon</code> and a required <code>label</code>. The label names
          the button for screen readers and is shown in a <code>Tooltip</code> on hover and on
          keyboard focus, as for <code>IconButton</code>. With text, <code>icon</code> is optional
          and shown before it.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'ToggleButtonIconExample.tsx', code: toggleButtonIconSource },
            { fileName: 'ToggleButtonIconExample.module.css', code: toggleButtonIconStyles },
          ]}
        >
          <ToggleButtonIconExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Disabled">
        <p>
          A disabled toggle ignores the mouse and the keyboard and leaves the Tab order. A pressed
          disabled toggle keeps a dimmed selection background, so its state stays visible. With{' '}
          <code>focusableWhenDisabled</code> it stays reachable in a toolbar: see the Toolbar page.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'ToggleButtonDisabledExample.tsx', code: toggleButtonDisabledSource },
            {
              fileName: 'ToggleButtonDisabledExample.module.css',
              code: toggleButtonDisabledStyles,
            },
          ]}
        >
          <ToggleButtonDisabledExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Other props">
        <p>
          <code>ref</code>, native attributes and <code>className</code> work as for{' '}
          <code>Button</code>, except <code>onClick</code>, <code>aria-pressed</code>,{' '}
          <code>aria-label</code> and <code>title</code>, which the toggle sets itself or replaces
          with a tooltip. Inside a toolbar or another roving focus group the toggle joins the
          group&apos;s arrow order.
        </p>
      </PageSection>
    </>
  );
}
