import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { SelectActionExample } from './SelectActionExample';
import selectActionStyles from './SelectActionExample.module.css?raw';
import selectActionSource from './SelectActionExample.tsx?raw';
import { SelectExample } from './SelectExample';
import selectStyles from './SelectExample.module.css?raw';
import selectSource from './SelectExample.tsx?raw';
import { SelectToolbarExample } from './SelectToolbarExample';
import selectToolbarStyles from './SelectToolbarExample.module.css?raw';
import selectToolbarSource from './SelectToolbarExample.tsx?raw';
import { selectPageMessages } from './selectPageMessages';

export function SelectPage() {
  const doc = useDocMessages(selectPageMessages);

  return (
    <>
      <PageSection title={doc('choosingValueTitle')}>
        <p>{doc('choosingValueText')}</p>
        <p>{doc('choosingValueText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'SelectExample.tsx', code: selectSource },
            { fileName: 'SelectExample.module.css', code: selectStyles },
          ]}
        >
          <SelectExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('actionAtTitle')}>
        <p>{doc('actionAtText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'SelectActionExample.tsx', code: selectActionSource },
            { fileName: 'SelectActionExample.module.css', code: selectActionStyles },
          ]}
        >
          <SelectActionExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('toolbarTitle')}>
        <p>{doc('toolbarText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'SelectToolbarExample.tsx', code: selectToolbarSource },
            { fileName: 'SelectToolbarExample.module.css', code: selectToolbarStyles },
          ]}
        >
          <SelectToolbarExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('keyboardTitle')}>
        <ul>
          <li>{doc('keyboardItem')}</li>
          <li>{doc('keyboardItem2')}</li>
          <li>{doc('keyboardItem3')}</li>
          <li>{doc('keyboardItem4')}</li>
        </ul>
        <p>{doc('keyboardText')}</p>
      </PageSection>
    </>
  );
}
