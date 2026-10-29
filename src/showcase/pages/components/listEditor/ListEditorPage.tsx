import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { ListEditorExample } from './ListEditorExample';
import listEditorStyles from './ListEditorExample.module.css?raw';
import listEditorSource from './ListEditorExample.tsx?raw';
import { listEditorPageMessages } from './listEditorPageMessages';

export function ListEditorPage() {
  const doc = useDocMessages(listEditorPageMessages);

  return (
    <>
      <PageSection title={doc('editingTitle')}>
        <p>{doc('editingText')}</p>
        <p>{doc('editingText2')}</p>
        <p>{doc('editingText3')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'ListEditorExample.tsx', code: listEditorSource },
            { fileName: 'ListEditorExample.module.css', code: listEditorStyles },
          ]}
        >
          <ListEditorExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('reorderTitle')}>
        <p>{doc('reorderText')}</p>
      </PageSection>
      <PageSection title={doc('mixedTitle')}>
        <p>{doc('mixedText')}</p>
      </PageSection>
    </>
  );
}
