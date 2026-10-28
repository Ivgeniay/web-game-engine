import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { RadioGroupDisabledExample } from './RadioGroupDisabledExample';
import radioGroupDisabledStyles from './RadioGroupDisabledExample.module.css?raw';
import radioGroupDisabledSource from './RadioGroupDisabledExample.tsx?raw';
import { RadioGroupExample } from './RadioGroupExample';
import radioGroupStyles from './RadioGroupExample.module.css?raw';
import radioGroupSource from './RadioGroupExample.tsx?raw';
import { RadioGroupHorizontalExample } from './RadioGroupHorizontalExample';
import radioGroupHorizontalStyles from './RadioGroupHorizontalExample.module.css?raw';
import radioGroupHorizontalSource from './RadioGroupHorizontalExample.tsx?raw';

export function RadioGroupPage() {
  return (
    <>
      <PageSection title="Choosing one option">
        <p>
          RadioGroup chooses one value from a list of labelled options, typically in forms and
          settings. Each option is a native <code>input type=&quot;radio&quot;</code> with its
          label; clicking the label selects the option. The group has the <code>radiogroup</code>{' '}
          role and a required <code>label</code>.
        </p>
        <p>
          <code>value</code> is the chosen option or <code>null</code> when nothing is chosen yet.{' '}
          <code>onValueChange</code> receives the newly chosen option; a group cannot be cleared
          back to <code>null</code> by the user. The type of the value comes from{' '}
          <code>options</code>. For compact choices in toolbars use ToggleButtonGroup instead.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'RadioGroupExample.tsx', code: radioGroupSource },
            { fileName: 'RadioGroupExample.module.css', code: radioGroupStyles },
          ]}
        >
          <RadioGroupExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Horizontal layout">
        <p>
          <code>orientation=&quot;horizontal&quot;</code> places the options in a row that wraps
          when it does not fit. The keyboard works the same in both layouts. This group starts
          without a chosen option.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'RadioGroupHorizontalExample.tsx', code: radioGroupHorizontalSource },
            {
              fileName: 'RadioGroupHorizontalExample.module.css',
              code: radioGroupHorizontalStyles,
            },
          ]}
        >
          <RadioGroupHorizontalExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Disabled options">
        <p>
          An option with <code>disabled: true</code> cannot be chosen and is skipped by the arrow
          keys. <code>disabled</code> on the group disables every option and takes the group out of
          the Tab order.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'RadioGroupDisabledExample.tsx', code: radioGroupDisabledSource },
            { fileName: 'RadioGroupDisabledExample.module.css', code: radioGroupDisabledStyles },
          ]}
        >
          <RadioGroupDisabledExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Keyboard">
        <p>
          The group is one Tab stop. Tab lands on the chosen option, or on the first enabled one
          when nothing is chosen. Arrow keys in either direction move to the next or the previous
          option and choose it at once, wrapping around the ends. Space chooses the focused option,
          which matters only before anything is chosen. <code>lang</code> on an option marks the
          language of its label, and <code>className</code> is meant only for layout.
        </p>
      </PageSection>
    </>
  );
}
