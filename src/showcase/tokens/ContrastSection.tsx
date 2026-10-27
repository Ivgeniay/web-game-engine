import { useThemeStore } from '@/state/theme/useThemeStore';
import type { ContrastPairKind } from '@/themes/contrastPairs';
import styles from './ContrastSection.module.css';
import { getContrastRows } from './contrastRows';

const COLUMN_TITLES = ['sample', 'kind', 'foreground', 'background', 'ratio', 'min', 'result'];
const TEXT_SAMPLE = 'Text sample';
const RATIO_FRACTION_DIGITS = 2;
const PASS_LABEL = 'pass';
const FAIL_LABEL = 'fail';
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
  const foregroundColor = colorReference(foreground);

  return (
    <div className={styles.sample} style={{ background: colorReference(background) }}>
      {kind === 'text' && <span style={{ color: foregroundColor }}>{TEXT_SAMPLE}</span>}
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

  return (
    <div className={styles.root}>
      <table className={styles.table}>
        <thead>
          <tr>
            {COLUMN_TITLES.map((title) => (
              <th key={title} className={styles.headerCell}>
                {title}
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
                  {row.passes ? PASS_LABEL : FAIL_LABEL}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
