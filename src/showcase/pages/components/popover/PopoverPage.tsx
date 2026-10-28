import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { PopoverExample } from './PopoverExample';
import popoverStyles from './PopoverExample.module.css?raw';
import popoverSource from './PopoverExample.tsx?raw';

export function PopoverPage() {
  return (
    <>
      <PageSection title="A panel at a button">
        <p>
          <code>Popover</code> shows any content in a floating panel next to its trigger, below it
          or above it when there is no room, and shrinks its height to fit the screen. The{' '}
          <code>trigger</code> function receives the props of the button that opens the panel;{' '}
          <code>label</code> names the panel for screen readers. <code>className</code> goes to the
          panel and lays out its content.
        </p>
        <p>
          When the panel opens, the focus moves to its first control. Esc, a click outside and
          moving the focus out of the panel close it, and the focus returns to the trigger. Popups
          opened from inside the panel, like the list of the select in the example, count as part of
          it: working with them does not close the panel, and Esc closes only the topmost one.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'PopoverExample.tsx', code: popoverSource },
            { fileName: 'PopoverExample.module.css', code: popoverStyles },
          ]}
        >
          <PopoverExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Control from outside">
        <p>
          By default the panel keeps its open state itself. Pass <code>open</code> and{' '}
          <code>onOpenChange</code> to decide it from outside; <code>onOpenChange</code> also works
          alone, as a notification.
        </p>
      </PageSection>
    </>
  );
}
