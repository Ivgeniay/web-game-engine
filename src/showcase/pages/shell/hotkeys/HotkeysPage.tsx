import { useDocMessages } from '@/showcase/i18n/useDocMessages';
import { formatShortcut } from '@/core/hotkeys/formatShortcut';
import { PLATFORMS } from '@/core/hotkeys/platform';
import type { Platform } from '@/core/hotkeys/platform';
import { RESERVED_SHORTCUTS } from '@/core/hotkeys/reservedShortcuts';
import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { Kbd } from '@/ui/kbd/Kbd';
import { HotkeyScopesExample } from './HotkeyScopesExample';
import hotkeyScopesStyles from './HotkeyScopesExample.module.css?raw';
import hotkeyScopesSource from './HotkeyScopesExample.tsx?raw';
import styles from './HotkeysPage.module.css';
import { ShortcutFormatExample } from './ShortcutFormatExample';
import shortcutFormatStyles from './ShortcutFormatExample.module.css?raw';
import shortcutFormatSource from './ShortcutFormatExample.tsx?raw';

const PLATFORM_NAMES: Readonly<Record<Platform, string>> = {
  other: 'Windows and Linux:',
  mac: 'macOS:',
};
import { hotkeysPageMessages } from './hotkeysPageMessages';

export function HotkeysPage() {
  const doc = useDocMessages(hotkeysPageMessages);

  return (
    <>
      <PageSection title={doc('declaringShortcutTitle')}>
        <p>{doc('declaringShortcutText')}</p>
        <p>{doc('declaringShortcutText2')}</p>
      </PageSection>
      <PageSection title={doc('whichKeyTitle')}>
        <p>{doc('whichKeyText')}</p>
        <ul>
          <li>{doc('whichKeyItem')}</li>
          <li>{doc('whichKeyItem2')}</li>
        </ul>
      </PageSection>
      <PageSection title={doc('showingShortcutTitle')}>
        <p>{doc('showingShortcutText')}</p>
        <p>{doc('showingShortcutText2')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'ShortcutFormatExample.tsx', code: shortcutFormatSource },
            { fileName: 'ShortcutFormatExample.module.css', code: shortcutFormatStyles },
          ]}
        >
          <ShortcutFormatExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('scopesTitle')}>
        <p>{doc('scopesText')}</p>
        <p>{doc('scopesText2')}</p>
        <p>{doc('scopesText3')}</p>
        <ExampleBlock
          sources={[
            { fileName: 'HotkeyScopesExample.tsx', code: hotkeyScopesSource },
            { fileName: 'HotkeyScopesExample.module.css', code: hotkeyScopesStyles },
          ]}
        >
          <HotkeyScopesExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title={doc('whenShortcutsTitle')}>
        <ul>
          <li>{doc('whenShortcutsItem')}</li>
          <li>{doc('whenShortcutsItem2')}</li>
          <li>{doc('whenShortcutsItem3')}</li>
          <li>{doc('whenShortcutsItem4')}</li>
        </ul>
      </PageSection>
      <PageSection title={doc('shortcutsFrameworkTitle')}>
        <ul>
          <li>{doc('shortcutsFrameworkItem')}</li>
          <li>{doc('shortcutsFrameworkItem2')}</li>
          <li>{doc('shortcutsFrameworkItem3')}</li>
        </ul>
        <p>{doc('shortcutsFrameworkText')}</p>
      </PageSection>
      <PageSection title={doc('startingControllerTitle')}>
        <p>{doc('startingControllerText')}</p>
        <p>{doc('startingControllerText2')}</p>
      </PageSection>
      <PageSection title={doc('errorsTitle')}>
        <p>{doc('errorsText')}</p>
        <ul>
          <li>{doc('errorsItem')}</li>
          <li>{doc('errorsItem2')}</li>
        </ul>
        {PLATFORMS.map((platform) => (
          <div key={platform} className={styles.reserved}>
            <span>{PLATFORM_NAMES[platform]}</span>
            {RESERVED_SHORTCUTS.filter(({ platforms }) => platforms.includes(platform)).map(
              ({ keys }) => (
                <Kbd key={keys} tone="primary">
                  {formatShortcut(keys, platform)}
                </Kbd>
              ),
            )}
          </div>
        ))}
      </PageSection>
    </>
  );
}
