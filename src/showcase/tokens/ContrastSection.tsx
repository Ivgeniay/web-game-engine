import { showcaseMessages } from '@/showcase/shell/showcaseMessages';
import { useMessages } from '@/state/language/useMessages';
import { useThemeStore } from '@/state/theme/useThemeStore';
import type { ContrastPairKind } from '@/themes/contrastPairs';
import styles from './ContrastSection.module.css';
import { getContrastRows } from './contrastRows';

const COLUMN_TITLE_KEYS = [
  'columnSample',
  'columnKind',
  'columnForeground',
  'columnBackground',
  'columnRatio',
  'columnMinimum',
  'columnResult',
] as const;
const RATIO_FRACTION_DIGITS = 2;
const COLOR_TOKEN_PREFIX = '--color-';

function colorReference(name: string): string {
  return `var(${COLOR_TOKEN_PREFIX}${name})`;
}

function PairSample({
  kind,
  foreground,
  background,
}: {
  readonly kind: ContrastPairKind;
  readonly foreground: string;
  readonly background: string;
}) {
  const t = useMessages(showcaseMessages);
  const foregroundColor = colorReference(foreground);

  return (
    <div className={styles.sample} style={{ background: colorReference(background) }}>
      {kind === 'text' && <span style={{ color: foregroundColor }}>{t('textSample')}</span>}
      {kind === 'indicator' && (
        <span className={styles.indicator} style={{ background: foregroundColor }} />
      )}
      {kind === 'border' && (
        <span className={styles.border} style={{ borderColor: foregroundColor }} />
      )}
    </div>
  );
}

export function ContrastSection() {
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
  const rows = getContrastRows(resolvedTheme);
  const t = useMessages(showcaseMessages);

  return (
    <div className={styles.root}>
      <table className={styles.table}>
        <thead>
          <tr>
            {COLUMN_TITLE_KEYS.map((key) => (
              <th key={key} className={styles.headerCell}>
                {t(key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.foreground}-${row.background}`}>
              <td className={styles.cell}>
                <PairSample
                  kind={row.kind}
                  foreground={row.foreground}
                  background={row.background}
                />
              </td>
              <td className={styles.codeCell}>{row.kind}</td>
              <td className={styles.codeCell}>{row.foreground}</td>
              <td className={styles.codeCell}>{row.background}</td>
              <td className={styles.codeCell}>{row.ratio.toFixed(RATIO_FRACTION_DIGITS)}</td>
              <td className={styles.codeCell}>{row.minContrast}</td>
              <td className={styles.codeCell}>
                <span className={styles.result}>
                  <span className={row.passes ? styles.passMark : styles.failMark} />
                  {row.passes ? t('contrastPass') : t('contrastFail')}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
