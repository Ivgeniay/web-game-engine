import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { UndoGroupExample } from './UndoGroupExample';
import undoGroupStyles from './UndoGroupExample.module.css?raw';
import undoGroupSource from './UndoGroupExample.tsx?raw';
import { UndoValueExample } from './UndoValueExample';
import undoValueStyles from './UndoValueExample.module.css?raw';
import undoValueSource from './UndoValueExample.tsx?raw';

export function UndoPage() {
  return (
    <>
      <PageSection title="Undo stack and operations">
        <p>
          The undo stack is <code>undo</code> in the editor registries. The framework does not know
          how the engine changes its data, so the stack keeps operations that the integration gives
          it: <code>UndoOperation</code> from <code>@/contracts/undo</code> with a{' '}
          <code>label</code> (a <code>MessageRef</code>), <code>undo</code> and <code>redo</code>.
          The change is already done when the operation is pushed: <code>undo.push(operation)</code>{' '}
          records it and drops the redo branch. <code>undo()</code>, <code>redo()</code>,{' '}
          <code>canUndo()</code>, <code>canRedo()</code>, <code>peekUndo()</code>,{' '}
          <code>clear()</code> and <code>subscribe()</code> are the rest of the API. The stack keeps
          the latest 200 operations, and operations pushed while undoing or redoing are ignored.
        </p>
      </PageSection>
      <PageSection title="Fields and the undo stack">
        <p>
          <code>useUndoableValue(&#123; label, read, write &#125;)</code> from{' '}
          <code>@/state/undo</code> turns the value change protocol into undo entries. Pass the
          handler it returns to a field and to the drag of its caption. A preview writes the value
          and remembers where the change started, a commit writes the value and records one entry
          from the start to the end, a cancel writes the start value back and records nothing. A
          commit that ends at the start value records nothing either. Arrays are compared item by
          item; pass <code>equals</code> for other values. For a checkbox or a select, call the
          handler with <code>&apos;commit&apos;</code>. Outside React,{' '}
          <code>createUndoableValue</code> from <code>@/core/undo/undoableValue</code> does the
          same.
        </p>
        <p>
          The framework commands <code>undoCommand</code> and <code>redoCommand</code> from{' '}
          <code>@/core/undo/undoCommands</code> run the stack and are disabled when there is nothing
          to undo or redo. <code>EditorFrame</code> registers their handlers; the integration puts
          them into its Edit menu. Outside the frame, as below, register them with{' '}
          <code>registerUndoCommands(commands, undo)</code>.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'UndoValueExample.tsx', code: undoValueSource },
            { fileName: 'UndoValueExample.module.css', code: undoValueStyles },
          ]}
        >
          <UndoValueExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Mod+Z in fields">
        <p>
          The commands have Mod+Z and Mod+Shift+Z with{' '}
          <code>allowInTextInput: &apos;whenCommitted&apos;</code>. A text and a number field mark
          their input with <code>data-value-edit</code>: while the typed text differs from the
          committed value, the shortcut is left to the browser and undoes the typing; once the text
          is committed or typed back, the shortcut undoes the last change in the editor. Other text
          inputs, such as a search field, always keep the browser&apos;s undo. The example above has
          no hotkey controller, so try the shortcuts in the demo scene.
        </p>
      </PageSection>
      <PageSection title="Grouping">
        <p>
          <code>undo.group(label, run)</code> records every operation pushed inside <code>run</code>{' '}
          as one entry, for example a change of several selected objects. Undo goes through the
          operations in reverse order. Groups inside a group join the outer one, and an empty group
          records nothing. The example uses a stack of its own, made by <code>createUndoStack</code>
          .
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'UndoGroupExample.tsx', code: undoGroupSource },
            { fileName: 'UndoGroupExample.module.css', code: undoGroupStyles },
          ]}
        >
          <UndoGroupExample />
        </ExampleBlock>
      </PageSection>
    </>
  );
}
