import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { ConfirmDialogExample } from './ConfirmDialogExample';
import confirmStyles from './ConfirmDialogExample.module.css?raw';
import confirmSource from './ConfirmDialogExample.tsx?raw';
import { ConfirmQueueExample } from './ConfirmQueueExample';
import queueStyles from './ConfirmQueueExample.module.css?raw';
import queueSource from './ConfirmQueueExample.tsx?raw';

export function ConfirmDialogPage() {
  return (
    <>
      <PageSection title="Asking from code">
        <p>
          <code>editor.dialogs.confirm(options)</code> shows a confirm dialog and returns a{' '}
          <code>Promise</code> with the answer: <code>&apos;confirm&apos;</code> or{' '}
          <code>&apos;cancel&apos;</code>. A command awaits it in its <code>run</code>. There is no
          dialog markup at the call site: <code>ConfirmDialogHost</code>, which the editor frame
          already contains, shows the requests.
        </p>
        <ul>
          <li>
            <code>title</code>, <code>message</code>, <code>confirmLabel</code> and{' '}
            <code>cancelLabel</code> are <code>MessageRef</code>. Without <code>cancelLabel</code>{' '}
            the button says Cancel.
          </li>
          <li>
            The confirm button is the main action on the right, and Enter chooses it. Escape and the
            cancel button answer <code>&apos;cancel&apos;</code>.
          </li>
          <li>
            With <code>destructive: true</code> the focus starts on the cancel button, so a hasty
            Enter keeps the data.
          </li>
          <li>
            A command run from a menu opens the dialog after the menu has closed and returned the
            focus, so the focus stays in the dialog.
          </li>
        </ul>
        <ExampleBlock
          sources={[
            { fileName: 'ConfirmDialogExample.tsx', code: confirmSource },
            { fileName: 'ConfirmDialogExample.module.css', code: confirmStyles },
          ]}
        >
          <ConfirmDialogExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Queue">
        <p>
          Requests wait in a queue: the second dialog appears only after the first one is answered.
          In the example, closing the project asks two questions at once and gets both answers in
          order.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'ConfirmQueueExample.tsx', code: queueSource },
            { fileName: 'ConfirmQueueExample.module.css', code: queueStyles },
          ]}
        >
          <ConfirmQueueExample />
        </ExampleBlock>
      </PageSection>
    </>
  );
}
