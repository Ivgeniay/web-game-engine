import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { CurrentThemeExample } from './CurrentThemeExample';
import currentThemeSource from './CurrentThemeExample.tsx?raw';
import { ThemeModeExample } from './ThemeModeExample';
import themeModeSource from './ThemeModeExample.tsx?raw';
import { TokenStyledPanelExample } from './TokenStyledPanelExample';
import tokenStyledPanelStyles from './TokenStyledPanelExample.module.css?raw';
import tokenStyledPanelSource from './TokenStyledPanelExample.tsx?raw';
import { themesPageMessages } from './themesPageMessages';

export function ThemesPage() {
  const doc = useDocMessages(themesPageMessages);

  return (
    <>
      <PageSection title={doc('modesTitle')}>
        <p>{doc('modesIntro')}</p>
        <ul>
          <li>{doc('modesDark')}</li>
          <li>{doc('modesLight')}</li>
          <li>{doc('modesSystem')}</li>
        </ul>
        <p>{doc('modesStorage')}</p>
      </PageSection>
      <PageSection title={doc('readingTitle')}>
        <p>{doc('readingStore')}</p>
        <p>{doc('readingRarelyNeeded')}</p>
        <ExampleBlock sources={[{ fileName: 'CurrentThemeExample.tsx', code: currentThemeSource }]}>
          <CurrentThemeExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('changingTitle')}>
        <p>{doc('changingSetMode')}</p>
        <ExampleBlock sources={[{ fileName: 'ThemeModeExample.tsx', code: themeModeSource }]}>
          <ThemeModeExample />
        </ExampleBlock>
        <p>{doc('changingStores')}</p>
      </PageSection>
      <PageSection title={doc('tokensTitle')}>
        <p>{doc('tokensIntro')}</p>
        <ul>
          <li>{doc('tokensNaming')}</li>
          <li>{doc('tokensStatus')}</li>
        </ul>
        <ExampleBlock
          sources={[
            { fileName: 'TokenStyledPanelExample.tsx', code: tokenStyledPanelSource },
            { fileName: 'TokenStyledPanelExample.module.css', code: tokenStyledPanelStyles },
          ]}
        >
          <TokenStyledPanelExample />
        </ExampleBlock>
      </PageSection>
    </>
  );
}
