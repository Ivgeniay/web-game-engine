import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { CheckboxDisabledExample } from './CheckboxDisabledExample';
import checkboxDisabledStyles from './CheckboxDisabledExample.module.css?raw';
import checkboxDisabledSource from './CheckboxDisabledExample.tsx?raw';
import { CheckboxExample } from './CheckboxExample';
import checkboxStyles from './CheckboxExample.module.css?raw';
import checkboxSource from './CheckboxExample.tsx?raw';
import { CheckboxMixedExample } from './CheckboxMixedExample';
import checkboxMixedStyles from './CheckboxMixedExample.module.css?raw';
import checkboxMixedSource from './CheckboxMixedExample.tsx?raw';

export function CheckboxPage() {
  return (
    <>
      <PageSection title="Checked state and label">
        <p>
          A checkbox switches a boolean value. The state is controlled: <code>checked</code> sets
          it, and <code>onCheckedChange</code> receives the requested new value. It is a native{' '}
          <code>input type=&quot;checkbox&quot;</code>, drawn with tokens.
        </p>
        <p>
          <code>label</code> shows a text to the right of the box, and clicking the text switches
          the checkbox too. Without a visible label, name the checkbox with <code>aria-label</code>{' '}
          or point to a caption with <code>aria-labelledby</code>: one of the three is required by
          the types. A label on the left comes from the property row around the field.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'CheckboxExample.tsx', code: checkboxSource },
            { fileName: 'CheckboxExample.module.css', code: checkboxStyles },
          ]}
        >
          <CheckboxExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Mixed state">
        <p>
          <code>checked=&quot;mixed&quot;</code> shows a dash: some of the values behind the
          checkbox are on and some are off, as with several selected objects or a group of child
          options. Screen readers announce it as partially checked. A click on a mixed checkbox asks
          for <code>true</code>; the owner decides what that means and passes the new value back.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'CheckboxMixedExample.tsx', code: checkboxMixedSource },
            { fileName: 'CheckboxMixedExample.module.css', code: checkboxMixedStyles },
          ]}
        >
          <CheckboxMixedExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Disabled">
        <p>
          A disabled checkbox ignores the mouse, the keyboard and clicks on its label, leaves the
          Tab order and shows its state in disabled colors.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'CheckboxDisabledExample.tsx', code: checkboxDisabledSource },
            { fileName: 'CheckboxDisabledExample.module.css', code: checkboxDisabledStyles },
          ]}
        >
          <CheckboxDisabledExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Keyboard and other props">
        <p>
          Tab reaches the checkbox and Space switches it, as with a native checkbox; Enter does
          nothing. Inside a toolbar the checkbox joins the toolbar&apos;s arrow order.{' '}
          <code>ref</code> receives the <code>input</code> element, and native input attributes such
          as <code>id</code>, <code>name</code> and <code>aria-describedby</code> pass through.{' '}
          <code>className</code> goes to the outer element and is meant only for layout.
        </p>
      </PageSection>
    </>
  );
}
