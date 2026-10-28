import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { SeparatorExample } from './SeparatorExample';
import separatorStyles from './SeparatorExample.module.css?raw';
import separatorSource from './SeparatorExample.tsx?raw';

export function SeparatorPage() {
  return (
    <>
      <PageSection title="Variants">
        <p>
          <code>Separator</code> divides groups of elements. A line has the <code>separator</code>{' '}
          role and <code>aria-orientation</code>:
        </p>
        <ul>
          <li>
            <code>orientation=&quot;horizontal&quot;</code>, the default, is a line across a column
            of elements;
          </li>
          <li>
            <code>orientation=&quot;vertical&quot;</code> is a short line between groups in a row,
            for example in a toolbar.
          </li>
        </ul>
        <p>
          <code>variant=&quot;flexible&quot;</code> draws nothing: it is an empty gap that takes the
          free space of a row and pushes the elements after it to the end. It is hidden from screen
          readers. A separator never receives the focus.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'SeparatorExample.tsx', code: separatorSource },
            { fileName: 'SeparatorExample.module.css', code: separatorStyles },
          ]}
        >
          <SeparatorExample />
        </ExampleBlock>
      </PageSection>
    </>
  );
}
