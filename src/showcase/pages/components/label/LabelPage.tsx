import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { LabelForFieldExample } from './LabelForFieldExample';
import labelForFieldStyles from './LabelForFieldExample.module.css?raw';
import labelForFieldSource from './LabelForFieldExample.tsx?raw';
import { LabelTonesExample } from './LabelTonesExample';
import labelTonesStyles from './LabelTonesExample.module.css?raw';
import labelTonesSource from './LabelTonesExample.tsx?raw';
import { LabelTruncateExample } from './LabelTruncateExample';
import labelTruncateStyles from './LabelTruncateExample.module.css?raw';
import labelTruncateSource from './LabelTruncateExample.tsx?raw';

export function LabelPage() {
  return (
    <>
      <PageSection title="Tones and selection">
        <p>
          <code>Label</code> shows a ready string. <code>tone</code> picks the text color:{' '}
          <code>primary</code> by default, <code>secondary</code> for hints and{' '}
          <code>disabled</code> for unavailable items. Interface text cannot be selected in the
          editor; <code>selectable</code> allows selecting and copying the text, for values such as
          identifiers and paths. A label never receives the focus.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'LabelTonesExample.tsx', code: labelTonesSource },
            { fileName: 'LabelTonesExample.module.css', code: labelTonesStyles },
          ]}
        >
          <LabelTonesExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Truncation">
        <p>
          With <code>truncate</code> the text stays on one line and ends with an ellipsis when it
          does not fit. Only while the text is cut off, the full text is shown in a{' '}
          <code>Tooltip</code> on hover. Drag the corner of the box to see the tooltip appear and
          disappear.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'LabelTruncateExample.tsx', code: labelTruncateSource },
            { fileName: 'LabelTruncateExample.module.css', code: labelTruncateStyles },
          ]}
        >
          <LabelTruncateExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Naming a field">
        <p>
          With <code>htmlFor</code> the label becomes a <code>label</code> element tied to the field
          with that id. For a field that is named by reference, give the label an <code>id</code>{' '}
          and pass it to the field as <code>aria-labelledby</code>, as the example does for a
          checkbox. <code>ref</code> receives the element, <code>className</code> is meant only for
          layout.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'LabelForFieldExample.tsx', code: labelForFieldSource },
            { fileName: 'LabelForFieldExample.module.css', code: labelForFieldStyles },
          ]}
        >
          <LabelForFieldExample />
        </ExampleBlock>
      </PageSection>
    </>
  );
}
