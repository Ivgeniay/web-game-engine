import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { DialogConfirmExample } from './DialogConfirmExample';
import dialogConfirmStyles from './DialogConfirmExample.module.css?raw';
import dialogConfirmSource from './DialogConfirmExample.tsx?raw';
import { DialogFormExample } from './DialogFormExample';
import dialogFormStyles from './DialogFormExample.module.css?raw';
import dialogFormSource from './DialogFormExample.tsx?raw';

export function DialogPage() {
  return (
    <>
      <PageSection title="A modal window">
        <p>
          <code>Dialog</code> shows a modal window above the editor and dims everything behind it
          with <code>--color-overlay-backdrop</code>. The owner decides whether it is open:{' '}
          <code>open</code> shows it, <code>onClose</code> asks to close it on Esc. A click on the
          dimmed area does not close a dialog.
        </p>
        <p>
          <code>title</code> is required: it is the heading and the name of the dialog for screen
          readers. <code>description</code> is an optional line below it. The content goes to{' '}
          <code>children</code>, the buttons to <code>actions</code>; they are aligned to the right,
          the main action last. <code>className</code> lays out the content.
        </p>
        <p>
          Popups opened inside a dialog appear above it: the list of the select and the hints of the
          icon buttons in the example. Esc closes only the topmost of them.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'DialogFormExample.tsx', code: dialogFormSource },
            { fileName: 'DialogFormExample.module.css', code: dialogFormStyles },
          ]}
        >
          <DialogFormExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="The main action and Enter">
        <p>
          The dialog is a form. Give the main action <code>type=&quot;submit&quot;</code> and pass{' '}
          <code>onSubmit</code>: the main button and Enter both run it. Enter is left to buttons,
          lists, multi-line fields and to any field that handles it itself, so it runs the main
          action only from places where it has no other meaning. Without <code>onSubmit</code>,
          Enter does nothing.
        </p>
        <p>
          When the dialog opens, the focus moves to its first control, usually the first field. A
          dialog without fields should start on its main action: pass a ref to that button as{' '}
          <code>initialFocus</code>, as the example does.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'DialogConfirmExample.tsx', code: dialogConfirmSource },
            { fileName: 'DialogConfirmExample.module.css', code: dialogConfirmStyles },
          ]}
        >
          <DialogConfirmExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Focus">
        <p>
          Tab and Shift+Tab move only inside the dialog, and the rest of the editor is hidden from
          screen readers while it is open. After closing, the focus returns to the control that
          opened the dialog. A confirmation that code opens and awaits will be built on top of this
          component.
        </p>
      </PageSection>
    </>
  );
}
