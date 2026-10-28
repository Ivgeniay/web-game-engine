import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { TextFieldExample } from './TextFieldExample';
import textFieldStyles from './TextFieldExample.module.css?raw';
import textFieldSource from './TextFieldExample.tsx?raw';
import { TextFieldLiveExample } from './TextFieldLiveExample';
import textFieldLiveStyles from './TextFieldLiveExample.module.css?raw';
import textFieldLiveSource from './TextFieldLiveExample.tsx?raw';
import { TextFieldStatesExample } from './TextFieldStatesExample';
import textFieldStatesStyles from './TextFieldStatesExample.module.css?raw';
import textFieldStatesSource from './TextFieldStatesExample.tsx?raw';
import { TextFieldValidationExample } from './TextFieldValidationExample';
import textFieldValidationStyles from './TextFieldValidationExample.module.css?raw';
import textFieldValidationSource from './TextFieldValidationExample.tsx?raw';

export function TextFieldPage() {
  return (
    <>
      <PageSection title="Editing and committing">
        <p>
          A text field edits one line of text. The value is controlled: <code>value</code> sets it,
          and <code>onValueChange(value, phase)</code> receives changes together with their phase
          from the value change protocol in <code>@/contracts/valueChange</code>.
        </p>
        <p>
          By default the field is delayed: typing changes only the text inside the field, and the
          owner receives one <code>commit</code> on Enter or when focus leaves the field, Tab
          included. Leaving the field without changes commits nothing. Esc drops the typed text,
          returns the value and leaves the field. While a draft is being typed, a new{' '}
          <code>value</code> from outside waits until the edit ends. The field has no caption of its
          own: point a <code>Label</code> to it with <code>htmlFor</code>, use{' '}
          <code>aria-label</code>, or let a property row give the caption.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'TextFieldExample.tsx', code: textFieldSource },
            { fileName: 'TextFieldExample.module.css', code: textFieldStyles },
          ]}
        >
          <TextFieldExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Live updates and the protocol">
        <p>
          With <code>updateMode=&quot;live&quot;</code> every input reaches the owner as a{' '}
          <code>preview</code>, so the scene can follow the typing. Enter or leaving the field ends
          the edit with one <code>commit</code>, and Esc ends it with a <code>cancel</code> that
          carries the value from the start of the edit. An undo stack records one entry on{' '}
          <code>commit</code> and ignores previews. An owner that does not care about phases can
          pass a plain setter: every phase carries the value to show.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'TextFieldLiveExample.tsx', code: textFieldLiveSource },
            { fileName: 'TextFieldLiveExample.module.css', code: textFieldLiveStyles },
          ]}
        >
          <TextFieldLiveExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Invalid value">
        <p>
          <code>validate</code> receives the typed text and returns a message for an invalid text or{' '}
          <code>undefined</code> for a valid one. While the text is invalid, the field shows an
          error border, sets <code>aria-invalid</code> and shows the message in a bubble linked with{' '}
          <code>aria-describedby</code>. An invalid text is never committed or previewed: Enter and
          leaving the field return the last valid value. Clear the field below or type a slash to
          see it.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'TextFieldValidationExample.tsx', code: textFieldValidationSource },
            { fileName: 'TextFieldValidationExample.module.css', code: textFieldValidationStyles },
          ]}
        >
          <TextFieldValidationExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Read-only, disabled, mixed and password">
        <p>
          A read-only field stays in the Tab order and lets you select and copy the text. A disabled
          field ignores the mouse and the keyboard and leaves the Tab order. <code>mixed</code>{' '}
          shows a dash when the selected objects have different values; any edit is committed, even
          one that matches <code>value</code>, so the owner can apply it to every object.{' '}
          <code>type=&quot;password&quot;</code> hides the text.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'TextFieldStatesExample.tsx', code: textFieldStatesSource },
            { fileName: 'TextFieldStatesExample.module.css', code: textFieldStatesStyles },
          ]}
        >
          <TextFieldStatesExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Keyboard and other props">
        <p>
          Ctrl+Z inside the field is the browser&apos;s own undo of the typed text. Esc that drops a
          typed text stays in the field and does not close a dialog, popover or menu around it; the
          next Esc does. Editor hotkeys do not fire while focus is in the field, except those that
          allow it. Inside a toolbar the field joins the toolbar&apos;s Tab stop and keeps the arrow
          keys for the caret. <code>size</code> takes <code>sm</code>, <code>md</code> or{' '}
          <code>lg</code>. <code>ref</code> receives the <code>input</code> element, and native
          input attributes such as <code>id</code>, <code>name</code>, <code>placeholder</code> and{' '}
          <code>aria-describedby</code> pass through. <code>className</code> goes to the outer box
          and is meant only for layout.
        </p>
      </PageSection>
    </>
  );
}
