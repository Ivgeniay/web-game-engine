import { TOKEN_GROUPS, groupTokenNames, parseCustomPropertyNames } from '@/themes/customProperties';
import darkCss from '@/themes/dark.css?raw';
import tokensCss from '@/themes/tokens.css?raw';
import { ContrastSection } from './ContrastSection';
import styles from './Showcase.module.css';
import { ThemeSwitcher } from './ThemeSwitcher';
import { TokenSection } from './TokenSection';

const TITLE = 'showcase';

const GROUPED_TOKEN_NAMES = groupTokenNames([
  ...parseCustomPropertyNames(darkCss),
  ...parseCustomPropertyNames(tokensCss),
]);

export function Showcase() {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1 className={styles.title}>{TITLE}</h1>
        <ThemeSwitcher />
      </header>
      <main className={styles.content}>
        {TOKEN_GROUPS.map((group) => (
          <TokenSection key={group} group={group} names={GROUPED_TOKEN_NAMES[group]} />
        ))}
        <ContrastSection />
      </main>
    </div>
  );
}
