import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { SceneToolbarExample } from './SceneToolbarExample';
import sceneToolbarStyles from './SceneToolbarExample.module.css?raw';
import sceneToolbarSource from './SceneToolbarExample.tsx?raw';

export function ToolbarPage() {
  return (
    <>
      <PageSection title="A toolbar of primitives">
        <p>
          Toolbar is a row of controls along the edge of a window. It has the <code>toolbar</code>{' '}
          role and a required <code>label</code>, the height of <code>--size-toolbar-height</code>{' '}
          and the header background. Put any primitives inside: the example uses every primitive of
          this section except RadioGroup, which belongs in forms; a toolbar uses ToggleButtonGroup
          for the same choice.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'SceneToolbarExample.tsx', code: sceneToolbarSource },
            { fileName: 'SceneToolbarExample.module.css', code: sceneToolbarStyles },
          ]}
        >
          <SceneToolbarExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Keyboard">
        <p>
          The whole toolbar is one Tab stop, built on roving focus. Left and Right move through the
          controls and skip disabled ones, Home and End go to the ends, and the focus wraps around.
          Tab lands on the control focused last; before that, on the chosen option of a toggle group
          or on the first control.
        </p>
        <p>
          Button, IconButton, ToggleButton and Checkbox join the toolbar by themselves, and the
          buttons of a ToggleButtonGroup join it one by one, so the arrow keys go through the group
          too. Text fields inside a toolbar keep Left and Right for the caret.
        </p>
      </PageSection>
      <PageSection title="Layout">
        <p>
          Controls sit in a row with a small gap. A vertical <code>Separator</code> divides groups,
          and a flexible one pushes the controls after it to the end. The toolbar does not hide
          overflowing controls yet: that is planned as a &quot;more&quot; menu. Use{' '}
          <code>className</code> only for the placement of the toolbar, for example a border towards
          the content below.
        </p>
      </PageSection>
    </>
  );
}
