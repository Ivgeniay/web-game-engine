import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { NumberFieldExample } from './NumberFieldExample';
import numberFieldStyles from './NumberFieldExample.module.css?raw';
import numberFieldSource from './NumberFieldExample.tsx?raw';
import { NumberFieldIntegerExample } from './NumberFieldIntegerExample';
import numberFieldIntegerStyles from './NumberFieldIntegerExample.module.css?raw';
import numberFieldIntegerSource from './NumberFieldIntegerExample.tsx?raw';
import { NumberFieldStatesExample } from './NumberFieldStatesExample';
import numberFieldStatesStyles from './NumberFieldStatesExample.module.css?raw';
import numberFieldStatesSource from './NumberFieldStatesExample.tsx?raw';

export function NumberFieldPage() {
  return (
    <>
      <PageSection title="Typing a number">
        <p>
          A number field edits a <code>number</code>. It works like a text field: the value is
          controlled, changes arrive through <code>onValueChange(value, phase)</code> with the
          preview, commit and cancel phases, the field commits on Enter or blur by default and
          reverts on Esc, and <code>updateMode=&quot;live&quot;</code> previews every valid input.
        </p>
        <p>
          The field lets in only what can become a number: digits, one minus at the start when the
          minimum allows negative values, and for a float one decimal separator. Both a point and a
          comma work as the separator. A character that does not fit is not typed, and a paste that
          does not fit is rejected as a whole. The value is shown with the separator of the
          interface language and without digit grouping: switch the language in the header to see
          it. The field reads the language from a locale context that <code>StoresProvider</code>{' '}
          fills; outside it the field uses English.
        </p>
        <p>
          <code>precision</code> limits the shown decimal places, 3 by default. It changes only the
          display: focusing and leaving the field without typing commits nothing, so the stored
          value keeps all its digits.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'NumberFieldExample.tsx', code: numberFieldSource },
            { fileName: 'NumberFieldExample.module.css', code: numberFieldStyles },
          ]}
        >
          <NumberFieldExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Integers, range and step">
        <p>
          <code>kind=&quot;integer&quot;</code> accepts only whole numbers; the default is{' '}
          <code>float</code>. <code>min</code> and <code>max</code> set the range. A number out of
          range or an unfinished one, such as a lone minus, shows the invalid state: an error
          border, <code>aria-invalid</code> and a message in a bubble. On commit a number out of
          range moves to the nearest limit, and an empty or unfinished text returns the last valid
          value. Integers also stay within the safe integer range of JavaScript.
        </p>
        <p>
          The messages come ready through <code>invalidMessages</code>, because the field does not
          translate. <code>useNumberFieldMessages(&#123; min, max &#125;)</code> from{' '}
          <code>@/state/fields</code> gives translated messages with the limits in them.
        </p>
        <p>
          The Up and Down arrows change the value by <code>step</code>: 1 for an integer and 0.1 for
          a float by default. With Shift the step is ten times finer, with Alt ten times coarser; an
          integer still moves by at least one. Arrow steps are previews, so a series of presses ends
          with one commit on Enter or blur, and Esc returns the value from before the first press.
          Floating point noise is rounded away: 0.2 and 0.1 give 0.3.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'NumberFieldIntegerExample.tsx', code: numberFieldIntegerSource },
            { fileName: 'NumberFieldIntegerExample.module.css', code: numberFieldIntegerStyles },
          ]}
        >
          <NumberFieldIntegerExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Mixed, read-only and disabled">
        <p>
          <code>mixed</code> shows a dash for different values of several selected objects, and any
          edit is committed so the owner can apply it to every object. A read-only field stays in
          the Tab order and ignores typing and the arrows. A disabled field leaves the Tab order.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'NumberFieldStatesExample.tsx', code: numberFieldStatesSource },
            { fileName: 'NumberFieldStatesExample.module.css', code: numberFieldStatesStyles },
          ]}
        >
          <NumberFieldStatesExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Keyboard and other props">
        <p>
          The field is a text input with the <code>spinbutton</code> role, so screen readers
          announce the value and the limits. Changing the value by dragging the caption arrives with
          the property row. Expressions such as <code>2*3</code> and large integers beyond{' '}
          <code>number</code> are not supported yet. Esc that cancels an edit does not reach a
          dialog, popover or menu around the field; the next Esc closes it. <code>size</code>,{' '}
          <code>ref</code>, native attributes and <code>className</code> work as in the text field.
        </p>
      </PageSection>
    </>
  );
}
