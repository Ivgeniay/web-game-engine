import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { DragAndDropExample } from './DragAndDropExample';
import dragAndDropStyles from './DragAndDropExample.module.css?raw';
import dragAndDropSource from './DragAndDropExample.tsx?raw';

export function DragAndDropPage() {
  return (
    <>
      <PageSection title="Moving data between parts of the editor">
        <p>
          Drag and drop moves typed data: <code>DragData</code> has a <code>type</code>, the{' '}
          <code>ids</code> of what is dragged and a ready <code>label</code> for the preview next to
          the pointer. The mechanism is built on Pointer Events, not on HTML5 drag and drop, which
          stays for files from the operating system and dockview tabs. A source and a target may
          live in different windows: a row from Project can land in Inspector.
        </p>
        <p>
          The entry point wraps the application in <code>DragAndDropLayer</code> inside{' '}
          <code>PopupLayer</code>. The layer keeps the drag session and draws the preview on the
          popup layer with the <code>--z-drag</code> token. Tooltips do not open while something is
          dragged. Without the layer the hooks throw, but only when drag and drop is enabled, so a{' '}
          <code>TreeView</code> without dragging works anywhere.
        </p>
      </PageSection>
      <PageSection title="Sources and targets">
        <p>
          <code>useDragSource</code> returns <code>startDrag</code>: call it from{' '}
          <code>onPointerDown</code> with a function that builds the data. The drag starts after the
          pointer moves 3 pixels, so a click stays a click, and the function runs only then; it may
          return <code>null</code> to refuse. The click that follows a drag is swallowed. Esc
          cancels the drag.
        </p>
        <p>
          <code>useDropTarget</code> takes <code>accepts</code>, the data types it takes,{' '}
          <code>onDragOver</code>, which returns whether the data can land at the pointer,{' '}
          <code>onDragLeave</code> and <code>onDrop</code>. Spread <code>dropTargetProps</code> on
          the target element; <code>isOver</code> is true while allowed data is over it. A target
          does not see data of other types at all. In the example the mesh does not fit the texture
          slot.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'DragAndDropExample.tsx', code: dragAndDropSource },
            { fileName: 'DragAndDropExample.module.css', code: dragAndDropStyles },
          ]}
        >
          <DragAndDropExample />
        </ExampleBlock>
        <p>
          Keyboard dragging is not available yet. Highlight a target with{' '}
          <code>overlay-drop-target</code> and <code>border-drop-indicator</code>, as the tree does.
        </p>
      </PageSection>
    </>
  );
}
