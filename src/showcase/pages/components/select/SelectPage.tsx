import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { SelectActionExample } from './SelectActionExample';
import selectActionStyles from './SelectActionExample.module.css?raw';
import selectActionSource from './SelectActionExample.tsx?raw';
import { SelectExample } from './SelectExample';
import selectStyles from './SelectExample.module.css?raw';
import selectSource from './SelectExample.tsx?raw';
import { SelectToolbarExample } from './SelectToolbarExample';
import selectToolbarStyles from './SelectToolbarExample.module.css?raw';
import selectToolbarSource from './SelectToolbarExample.tsx?raw';

export function SelectPage() {
  return (
    <>
      <PageSection title="Choosing a value">
        <p>
          <code>Select</code> chooses one value from a list. <code>options</code> is an array of
          entries: <code>option</code> with a <code>value</code>, a <code>label</code>, an optional{' '}
          <code>icon</code> and <code>disabled</code>, or a <code>separator</code>. The type of the
          value comes from the options, so <code>onValueChange</code> receives the same string
          union. <code>value</code> may be <code>null</code>; then the field shows{' '}
          <code>placeholder</code>.
        </p>
        <p>
          Name the field with <code>aria-label</code> or with <code>aria-labelledby</code> pointing
          to a visible caption, as in the example. The list opens with the chosen option focused and
          scrolled into view, marked with a check.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'SelectExample.tsx', code: selectSource },
            { fileName: 'SelectExample.module.css', code: selectStyles },
          ]}
        >
          <SelectExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="An action at the end">
        <p>
          <code>action</code> adds a command below the options, separated by a line, for example to
          create a new value. Choosing it runs <code>onSelect</code> and closes the list without
          changing the value.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'SelectActionExample.tsx', code: selectActionSource },
            { fileName: 'SelectActionExample.module.css', code: selectActionStyles },
          ]}
        >
          <SelectActionExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="In a toolbar">
        <p>
          The field takes <code>variant</code> and <code>size</code> like a button:{' '}
          <code>flat</code> and <code>sm</code> fit a toolbar. Inside a toolbar the field joins its
          arrow order.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'SelectToolbarExample.tsx', code: selectToolbarSource },
            { fileName: 'SelectToolbarExample.module.css', code: selectToolbarStyles },
          ]}
        >
          <SelectToolbarExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Keyboard">
        <ul>
          <li>Enter, Space and Alt+Down open the list.</li>
          <li>
            On the closed field, arrows and letters do nothing, so the value never changes by
            accident while moving through a panel.
          </li>
          <li>
            In the open list, Up and Down move and wrap around, Home and End go to the ends,
            disabled options are skipped, and typing the first letters moves to an option.
          </li>
          <li>
            Enter or Space chooses the option and returns the focus to the field. Esc and a click
            outside close the list without a change.
          </li>
        </ul>
        <p>
          Hints do not appear while the list is open. There is no search inside the list: a
          searchable list is a separate component. <code>disabled</code>, <code>id</code>,{' '}
          <code>ref</code> and <code>className</code> apply to the field.
        </p>
      </PageSection>
    </>
  );
}
