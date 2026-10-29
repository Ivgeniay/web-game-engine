import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { FoldoutExample } from './FoldoutExample';
import foldoutStyles from './FoldoutExample.module.css?raw';
import foldoutSource from './FoldoutExample.tsx?raw';

export function FoldoutPage() {
  return (
    <>
      <PageSection title="A collapsible group">
        <p>
          <code>Foldout</code> shows a header with an arrow and hides or shows its content. The
          state is controlled: <code>expanded</code> with <code>onExpandedChange</code>, so a window
          can keep it, for example to restore it in the next session. The content of a collapsed
          group stays mounted and is only hidden, so fields inside keep their state and nested
          groups can follow Alt+click.
        </p>
        <p>
          Alt+click on a header expands or collapses the group together with every group inside it,
          as in Unity: each nested <code>Foldout</code> calls its own <code>onExpandedChange</code>.
          A plain click changes only the clicked group. In the example, Alt+click on Quality opens
          all three levels.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'FoldoutExample.tsx', code: foldoutSource },
            { fileName: 'FoldoutExample.module.css', code: foldoutStyles },
          ]}
        >
          <FoldoutExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Keyboard and other props">
        <p>
          The header is a native button with <code>aria-expanded</code> and{' '}
          <code>aria-controls</code>. Enter and Space toggle it, Right expands and Left collapses;
          with Alt the arrows act on the nested groups too. <code>disabled</code>, <code>ref</code>{' '}
          and other button attributes go to the header, <code>className</code> goes to the outer box
          and is meant only for layout. The content is indented by one step and stacks its children
          in a column with a small gap, so captions and rows inside need no layout of their own.
        </p>
      </PageSection>
    </>
  );
}
