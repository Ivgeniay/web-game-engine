import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { TreeViewControlledExample } from './TreeViewControlledExample';
import treeViewControlledStyles from './TreeViewControlledExample.module.css?raw';
import treeViewControlledSource from './TreeViewControlledExample.tsx?raw';
import { TreeViewDragExample } from './TreeViewDragExample';
import treeViewDragStyles from './TreeViewDragExample.module.css?raw';
import treeViewDragSource from './TreeViewDragExample.tsx?raw';
import { TreeViewExample } from './TreeViewExample';
import treeViewStyles from './TreeViewExample.module.css?raw';
import treeViewSource from './TreeViewExample.tsx?raw';
import { TreeViewLargeExample } from './TreeViewLargeExample';
import treeViewRenameStyles from './TreeViewRenameExample.module.css?raw';
import treeViewRenameSource from './TreeViewRenameExample.tsx?raw';
import { TreeViewRenameExample } from './TreeViewRenameExample';
import treeViewSearchStyles from './TreeViewSearchExample.module.css?raw';
import treeViewSearchSource from './TreeViewSearchExample.tsx?raw';
import { TreeViewSearchExample } from './TreeViewSearchExample';
import treeViewLargeStyles from './TreeViewLargeExample.module.css?raw';
import treeViewLargeSource from './TreeViewLargeExample.tsx?raw';
import { treeViewPageMessages } from './treeViewPageMessages';

export function TreeViewPage() {
  const doc = useDocMessages(treeViewPageMessages);

  return (
    <>
      <PageSection title={doc('treeOverTitle')}>
        <p>{doc('treeOverText')}</p>
        <p>{doc('treeOverText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'TreeViewExample.tsx', code: treeViewSource },
            { fileName: 'TreeViewExample.module.css', code: treeViewStyles },
          ]}
        >
          <TreeViewExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('tenThousandTitle')}>
        <p>{doc('tenThousandText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'TreeViewLargeExample.tsx', code: treeViewLargeSource },
            { fileName: 'TreeViewLargeExample.module.css', code: treeViewLargeStyles },
          ]}
        >
          <TreeViewLargeExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('expandedNodesTitle')}>
        <p>{doc('expandedNodesText')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'TreeViewControlledExample.tsx', code: treeViewControlledSource },
            { fileName: 'TreeViewControlledExample.module.css', code: treeViewControlledStyles },
          ]}
        >
          <TreeViewControlledExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('renamingTitle')}>
        <p>{doc('renamingText')}</p>
        <p>{doc('renamingText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'TreeViewRenameExample.tsx', code: treeViewRenameSource },
            { fileName: 'TreeViewRenameExample.module.css', code: treeViewRenameStyles },
          ]}
        >
          <TreeViewRenameExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('searchTitle')}>
        <p>{doc('searchText')}</p>
        <p>{doc('searchText2')}</p>
        <p>{doc('searchText3')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'TreeViewSearchExample.tsx', code: treeViewSearchSource },
            { fileName: 'TreeViewSearchExample.module.css', code: treeViewSearchStyles },
          ]}
        >
          <TreeViewSearchExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('draggingRowsTitle')}>
        <p>{doc('draggingRowsText')}</p>
        <p>{doc('draggingRowsText2')}</p>
        <p>{doc('draggingRowsText3')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'TreeViewDragExample.tsx', code: treeViewDragSource },
            { fileName: 'TreeViewDragExample.module.css', code: treeViewDragStyles },
          ]}
        >
          <TreeViewDragExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('keyboardMouseTitle')}>
        <ul>
          <li>{doc('keyboardMouseItem')}</li>
          <li>{doc('keyboardMouseItem2')}</li>
          <li>{doc('keyboardMouseItem3')}</li>
          <li>{doc('keyboardMouseItem4')}</li>
          <li>{doc('keyboardMouseItem5')}</li>
          <li>{doc('keyboardMouseItem6')}</li>
          <li>{doc('keyboardMouseItem7')}</li>
        </ul>
        <p>{doc('keyboardMouseText')}</p>
      </PageSection>
    </>
  );
}
