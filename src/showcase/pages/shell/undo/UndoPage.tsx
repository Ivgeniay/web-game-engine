import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { UndoGroupExample } from './UndoGroupExample';
import undoGroupStyles from './UndoGroupExample.module.css?raw';
import undoGroupSource from './UndoGroupExample.tsx?raw';
import { UndoValueExample } from './UndoValueExample';
import undoValueStyles from './UndoValueExample.module.css?raw';
import undoValueSource from './UndoValueExample.tsx?raw';
import { undoPageMessages } from './undoPageMessages';

export function UndoPage() {
  const doc = useDocMessages(undoPageMessages);

  return (
    <>
      <PageSection title={doc('undoStackTitle')}>
        <p>{doc('undoStackText')}</p>
      </PageSection>
      <PageSection title={doc('fieldsUndoTitle')}>
        <p>{doc('fieldsUndoText')}</p>
        <p>{doc('fieldsUndoText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'UndoValueExample.tsx', code: undoValueSource },
            { fileName: 'UndoValueExample.module.css', code: undoValueStyles },
          ]}
        >
          <UndoValueExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('modZTitle')}>
        <p>{doc('modZText')}</p>
      </PageSection>
      <PageSection title={doc('groupingTitle')}>
        <p>{doc('groupingText')}</p>
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
