import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { IconExample } from './IconExample';
import iconStyles from './IconExample.module.css?raw';
import iconSource from './IconExample.tsx?raw';
import { IconFromDataExample } from './IconFromDataExample';
import iconFromDataStyles from './IconFromDataExample.module.css?raw';
import iconFromDataSource from './IconFromDataExample.tsx?raw';
import { IconGallery } from './IconGallery';
import { iconsPageMessages } from './iconsPageMessages';
import { IntegrationIconsExample } from './IntegrationIconsExample';
import integrationIconsStyles from './IntegrationIconsExample.module.css?raw';
import integrationIconsSource from './IntegrationIconsExample.tsx?raw';

export function IconsPage() {
  const doc = useDocMessages(iconsPageMessages);

  return (
    <>
      <PageSection title={doc('galleryTitle')}>
        <p>{doc('galleryIntro')}</p>
        <p>{doc('gallerySmallDrawing')}</p>
        <IconGallery />
      </PageSection>
      <PageSection title={doc('usingTitle')}>
        <p>{doc('usingSets')}</p>
        <p>{doc('usingColor')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'IconExample.tsx', code: iconSource },
            { fileName: 'IconExample.module.css', code: iconStyles },
          ]}
        >
          <IconExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('dataTitle')}>
        <p>{doc('dataInCode')}</p>
        <p>{doc('dataFromString')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'IconFromDataExample.tsx', code: iconFromDataSource },
            { fileName: 'IconFromDataExample.module.css', code: iconFromDataStyles },
          ]}
        >
          <IconFromDataExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('integrationTitle')}>
        <p>{doc('integrationOwnSet')}</p>
        <p>{doc('integrationFiles')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'IntegrationIconsExample.tsx', code: integrationIconsSource },
            { fileName: 'IntegrationIconsExample.module.css', code: integrationIconsStyles },
          ]}
        >
          <IntegrationIconsExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('drawingTitle')}>
        <p>{doc('drawingShapes')}</p>
        <ul>
          <li>{doc('drawingOriginal')}</li>
          <li>{doc('drawingGrid')}</li>
          <li>{doc('drawingLines')}</li>
          <li>{doc('drawingEnds')}</li>
          <li>{doc('drawingAxis')}</li>
          <li>{doc('drawingCircles')}</li>
          <li>{doc('drawingFills')}</li>
          <li>{doc('drawingWeight')}</li>
          <li>{doc('drawingCommands')}</li>
          <li>{doc('drawingColors')}</li>
        </ul>
        <p>{doc('drawingCheck')}</p>
      </PageSection>
    </>
  );
}
