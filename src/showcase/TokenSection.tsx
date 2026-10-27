import type { CSSProperties } from 'react';
import type { TokenGroup } from '@/themes/customProperties';
import styles from './TokenSection.module.css';
import { useTokenValues } from './useTokenValues';

interface TokenSectionProps {
  readonly group: TokenGroup;
  readonly names: readonly string[];
}

const COLUMN_TITLES = ['sample', 'token', 'value'];
const FONT_SAMPLE_TEXT = 'Aa Bb 0123';
const FONT_SAMPLE_MULTILINE_TEXT = 'Line height sample\nsecond line';
const ICON_SIZE_MARKER = '-icon-';

const FONT_LINE_HEIGHT_PREFIX = '--font-line-height-';

type SampleStyleFactory = (reference: string) => CSSProperties;

const FONT_SAMPLE_STYLES: readonly (readonly [string, SampleStyleFactory])[] = [
  ['--font-family-', (reference) => ({ fontFamily: reference })],
  ['--font-size-', (reference) => ({ fontSize: reference })],
  ['--font-weight-', (reference) => ({ fontWeight: reference })],
  [FONT_LINE_HEIGHT_PREFIX, (reference) => ({ lineHeight: reference })],
];

function tokenReference(name: string): string {
  return `var(${name})`;
}

function fontSampleStyle(name: string): CSSProperties {
  const entry = FONT_SAMPLE_STYLES.find(([prefix]) => name.startsWith(prefix));

  return entry === undefined ? {} : entry[1](tokenReference(name));
}

function isLineHeightToken(name: string): boolean {
  return name.startsWith(FONT_LINE_HEIGHT_PREFIX);
}

function sizeSampleStyle(name: string): CSSProperties {
  const size = tokenReference(name);

  return name.includes(ICON_SIZE_MARKER) ? { width: size, height: size } : { height: size };
}

function TokenSample({ group, name }: { readonly group: TokenGroup; readonly name: string }) {
  const reference = tokenReference(name);

  switch (group) {
    case 'color':
      return <div className={styles.colorSample} style={{ background: reference }} />;
    case 'font':
      return (
        <div className={styles.fontSample} style={fontSampleStyle(name)}>
          {isLineHeightToken(name) ? FONT_SAMPLE_MULTILINE_TEXT : FONT_SAMPLE_TEXT}
        </div>
      );
    case 'space':
      return <div className={styles.spaceSample} style={{ width: reference }} />;
    case 'size':
      return <div className={styles.sizeSample} style={sizeSampleStyle(name)} />;
    case 'radius':
      return <div className={styles.radiusSample} style={{ borderRadius: reference }} />;
    case 'shadow':
      return <div className={styles.shadowSample} style={{ boxShadow: reference }} />;
    case 'z':
    case 'duration':
    case 'easing':
      return null;
  }
}

export function TokenSection({ group, names }: TokenSectionProps) {
  const values = useTokenValues(names);

  return (
    <section className={styles.root}>
      <h2 className={styles.title}>{group}</h2>
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
          {names.map((name) => (
            <tr key={name}>
              <td className={styles.sampleCell}>
                <TokenSample group={group} name={name} />
              </td>
              <td className={styles.codeCell}>{name}</td>
              <td className={styles.codeCell}>{values.get(name)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
