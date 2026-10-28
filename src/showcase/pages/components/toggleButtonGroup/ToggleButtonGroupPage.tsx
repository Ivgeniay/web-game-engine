import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { IconOptionsExample } from './IconOptionsExample';
import iconOptionsStyles from './IconOptionsExample.module.css?raw';
import iconOptionsSource from './IconOptionsExample.tsx?raw';
import { MultipleSelectionExample } from './MultipleSelectionExample';
import multipleSelectionStyles from './MultipleSelectionExample.module.css?raw';
import multipleSelectionSource from './MultipleSelectionExample.tsx?raw';
import { OptionalSelectionExample } from './OptionalSelectionExample';
import optionalSelectionStyles from './OptionalSelectionExample.module.css?raw';
import optionalSelectionSource from './OptionalSelectionExample.tsx?raw';
import { SingleSelectionExample } from './SingleSelectionExample';
import singleSelectionStyles from './SingleSelectionExample.module.css?raw';
import singleSelectionSource from './SingleSelectionExample.tsx?raw';

export function ToggleButtonGroupPage() {
  return (
    <>
      <PageSection title="When to use it">
        <p>
          ToggleButtonGroup is a row of toggle buttons for compact choices in toolbars and headers:
          the transform tool, the view mode, snapping options. Arrow keys only move the focus, and
          an option is chosen with a click, Space or Enter. Moving through the tools does not switch
          the tool on the way.
        </p>
        <p>
          For a choice in a form or a settings panel, where the options are a list of labelled
          values, use RadioGroup. There arrow keys select the next option at once, as with native
          radio buttons.
        </p>
      </PageSection>
      <PageSection title="Exactly one">
        <p>
          With <code>selection=&quot;single&quot;</code> one option is always chosen.{' '}
          <code>value</code> is the chosen option, and clicking it again changes nothing.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'SingleSelectionExample.tsx', code: singleSelectionSource },
            { fileName: 'SingleSelectionExample.module.css', code: singleSelectionStyles },
          ]}
        >
          <SingleSelectionExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="None or one">
        <p>
          With <code>selection=&quot;optional&quot;</code> clicking the chosen option clears the
          choice, and <code>value</code> becomes <code>null</code>.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'OptionalSelectionExample.tsx', code: optionalSelectionSource },
            { fileName: 'OptionalSelectionExample.module.css', code: optionalSelectionStyles },
          ]}
        >
          <OptionalSelectionExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Several">
        <p>
          With <code>selection=&quot;multiple&quot;</code> every option is switched on its own.{' '}
          <code>value</code> is an array of the chosen options, always in the order of{' '}
          <code>options</code>. An option with <code>disabled: true</code> is skipped by the
          keyboard; <code>disabled</code> on the group disables every option.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'MultipleSelectionExample.tsx', code: multipleSelectionSource },
            { fileName: 'MultipleSelectionExample.module.css', code: multipleSelectionStyles },
          ]}
        >
          <MultipleSelectionExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Options">
        <p>
          Each option has a <code>value</code> and a <code>label</code>. <code>icon</code> adds an
          icon before the label, and <code>iconOnly: true</code> shows only the icon, with the label
          as the name and the hover hint. <code>lang</code> marks the language of the label, for
          example in a language switcher. The type of <code>value</code> comes from{' '}
          <code>options</code>, so <code>onValueChange</code> receives the same string union.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'IconOptionsExample.tsx', code: iconOptionsSource },
            { fileName: 'IconOptionsExample.module.css', code: iconOptionsStyles },
          ]}
        >
          <IconOptionsExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Keyboard and accessibility">
        <p>
          The group has the <code>group</code> role and a required <code>label</code>, and each
          option is a button with <code>aria-pressed</code> in every mode. The group is one Tab stop
          that starts at the chosen option. Inside a toolbar the group joins the toolbar&apos;s
          arrow order, so the whole toolbar stays one Tab stop. <code>variant</code>,{' '}
          <code>size</code> and <code>className</code> work as for <code>ToggleButton</code>.
        </p>
      </PageSection>
    </>
  );
}
