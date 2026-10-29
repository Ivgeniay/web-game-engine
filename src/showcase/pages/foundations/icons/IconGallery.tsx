import { useState } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import type { IconDefinition } from '@/icons/icon';
import { CodeBlock } from '@/showcase/template/CodeBlock';
import { useMessages } from '@/state/language/useMessages';
import { Checkbox } from '@/ui/checkbox/Checkbox';
import { Icon } from '@/ui/icon/Icon';
import styles from './IconGallery.module.css';
import { IconPixelPreview } from './IconPixelPreview';
import { iconsPageMessages } from './iconsPageMessages';

interface IconEntry {
  readonly name: string;
  readonly definition: IconDefinition;
}

const ICON_ENTRIES: readonly IconEntry[] = Object.entries(frameworkIcons).map(
  ([name, definition]) => ({ name, definition }),
);

const INITIAL_ENTRY: IconEntry = { name: 'close', definition: frameworkIcons.close };

const IDENTIFIER_PATTERN = /^[A-Za-z_$][\w$]*$/;

const SMALL_DRAWING_BADGE = '12×12';

function memberAccess(name: string): string {
  return IDENTIFIER_PATTERN.test(name) ? `.${name}` : `['${name}']`;
}

function usageCode(name: string): string {
  const icon = `frameworkIcons${memberAccess(name)}`;

  return [
    "import { frameworkIcons } from '@/icons/frameworkIcons';",
    "import { iconRef } from '@/icons/icon';",
    "import { Icon } from '@/ui/icon/Icon';",
    '',
    `<Icon icon={${icon}} />`,
    `<Icon icon={${icon}} size="sm" />`,
    '',
    `const fromData = iconRef(frameworkIcons, '${name}');`,
  ].join('\n');
}

export function IconGallery() {
  const [selected, setSelected] = useState(INITIAL_ENTRY);
  const [showOutline, setShowOutline] = useState(false);
  const t = useMessages(iconsPageMessages);

  return (
    <div className={styles.root}>
      <ul className={styles.tiles}>
        {ICON_ENTRIES.map((entry) => (
          <li key={entry.name}>
            <button
              className={styles.tile}
              type="button"
              aria-pressed={entry.name === selected.name}
              onClick={() => {
                setSelected(entry);
              }}
            >
              <span className={styles.samples}>
                <Icon icon={entry.definition} />
                <Icon icon={entry.definition} size="sm" />
              </span>
              <span className={styles.name}>{entry.name}</span>
              {entry.definition.sm !== undefined && (
                <span className={styles.badge}>{SMALL_DRAWING_BADGE}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
      <section className={styles.details}>
        <div className={styles.header}>
          <h3 className={styles.title}>{selected.name}</h3>
          <Checkbox
            checked={showOutline}
            onCheckedChange={setShowOutline}
            label={t('galleryShowOutline')}
          />
        </div>
        <div className={styles.previews}>
          <div className={styles.preview}>
            <span className={styles.caption}>{t('galleryMediumCaption')}</span>
            <IconPixelPreview icon={selected.definition} size="md" showOutline={showOutline} />
          </div>
          <div className={styles.preview}>
            <span className={styles.caption}>
              {selected.definition.sm === undefined
                ? t('gallerySmallScaledCaption')
                : t('gallerySmallOwnCaption')}
            </span>
            <IconPixelPreview icon={selected.definition} size="sm" showOutline={showOutline} />
          </div>
        </div>
        <CodeBlock fileName={t('galleryUsage')} code={usageCode(selected.name)} />
      </section>
    </div>
  );
}
