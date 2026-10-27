import styles from './TokenStyledPanelExample.module.css';

const TITLE = 'Inspector';
const TEXT = 'Colors, spacing, type and radius come from tokens, so the panel follows the theme.';

export function TokenStyledPanelExample() {
  return (
    <section className={styles.root}>
      <h3 className={styles.title}>{TITLE}</h3>
      <p className={styles.text}>{TEXT}</p>
    </section>
  );
}
