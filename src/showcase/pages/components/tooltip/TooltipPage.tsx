import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { TooltipExample } from './TooltipExample';
import tooltipStyles from './TooltipExample.module.css?raw';
import tooltipSource from './TooltipExample.tsx?raw';
import { TooltipGroupExample } from './TooltipGroupExample';
import tooltipGroupStyles from './TooltipGroupExample.module.css?raw';
import tooltipGroupSource from './TooltipGroupExample.tsx?raw';

export function TooltipPage() {
  return (
    <>
      <PageSection title="A hint on any control">
        <p>
          <code>Tooltip</code> shows a short hint next to a control: <code>content</code> is a ready
          string, <code>shortcut</code> an optional key combination shown with <code>Kbd</code>. Its
          child is a function that receives the trigger props; spread them on the control, including
          the <code>ref</code>. Any primitive works as a trigger.
        </p>
        <p>
          The hint appears after a hover delay of half a second, at once on keyboard focus, and
          hides when the pointer leaves, the focus moves away, the control is pressed or Esc is hit.
          It never takes the focus. The trigger is described by the hint through{' '}
          <code>aria-describedby</code>; pass <code>describe=&#123;false&#125;</code> when the hint
          repeats the accessible name of the control. <code>disabled</code> turns the hint off.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'TooltipExample.tsx', code: tooltipSource },
            { fileName: 'TooltipExample.module.css', code: tooltipStyles },
          ]}
        >
          <TooltipExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Built into primitives">
        <p>
          <code>IconButton</code>, an icon-only <code>ToggleButton</code> and a truncated{' '}
          <code>Label</code> show their tooltips by themselves, so most code never uses{' '}
          <code>Tooltip</code> directly. <code>IconButton</code> takes a <code>shortcut</code> for
          its tooltip.
        </p>
        <p>
          After one hint was shown, the hints of neighbouring controls appear without the delay:
          move the pointer along the row below. The grouping needs <code>PopupLayer</code> at the
          root of the app; see the Popup layer page.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'TooltipGroupExample.tsx', code: tooltipGroupSource },
            { fileName: 'TooltipGroupExample.module.css', code: tooltipGroupStyles },
          ]}
        >
          <TooltipGroupExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Limitations">
        <ul>
          <li>Hints do not appear while a menu or a list is open.</li>
          <li>
            A disabled control gets no pointer events, so it shows no hint. Explain why a command is
            unavailable elsewhere, for example in the status bar.
          </li>
        </ul>
      </PageSection>
    </>
  );
}
