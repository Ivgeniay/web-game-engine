import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { ValueDragExample } from './ValueDragExample';
import valueDragStyles from './ValueDragExample.module.css?raw';
import valueDragSource from './ValueDragExample.tsx?raw';

export function ValueDragPage() {
  return (
    <>
      <PageSection title="Dragging a number">
        <p>
          <code>useValueDrag(target, disabled)</code> from <code>@/ui/valueDrag</code> turns any
          element into a zone that changes a number by dragging left and right, like the caption of
          a numeric field in Unity. Spread <code>zoneProps</code> on the element: they add the
          two-way arrow cursor, the pointer handlers and a click guard. <code>dragging</code> tells
          whether a drag is running. Property rows use the hook for their captions, and vector
          fields will use it for axis captions.
        </p>
        <p>
          The target describes the number: <code>value</code>, <code>onValueChange</code>,{' '}
          <code>kind</code>, <code>min</code>, <code>max</code> and <code>step</code>, as in the
          number field. Every pixel moves the value by one step. With Shift the step is ten times
          finer, with Alt ten times coarser, and a modifier pressed in the middle of a drag affects
          only the movement after it. Pushing past a limit does not pile up: moving back changes the
          value at once.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'ValueDragExample.tsx', code: valueDragSource },
            { fileName: 'ValueDragExample.module.css', code: valueDragStyles },
          ]}
        >
          <ValueDragExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Protocol, threshold and cancel">
        <p>
          A drag follows the value change protocol: <code>preview</code> while the pointer moves,
          one <code>commit</code> on release, so an undo stack records one entry per drag, and{' '}
          <code>cancel</code> with the value from the start of the drag on Esc. The drag starts only
          after the pointer moves a few pixels, so a click on a caption changes nothing and still
          focuses its field; after a real drag the click is swallowed. Pressing the zone first ends
          an unfinished edit in a focused text field, so the drag starts from the committed value.
        </p>
      </PageSection>
      <PageSection title="Infinite drag">
        <p>
          By default the drag captures the pointer with <code>setPointerCapture</code> and stops
          growing at the edge of the screen. <code>infinite: true</code> locks the pointer with the
          Pointer Lock API instead: the cursor hides and the drag goes on past the screen edge, as
          in Unity. Browsers show a notice about the hidden cursor every time the lock starts, which
          is why the option is off by default. While the pointer is locked, the browser keeps Esc to
          itself and releases the lock, and the drag treats the release as a cancel.
        </p>
      </PageSection>
    </>
  );
}
