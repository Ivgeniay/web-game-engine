import { useState } from 'react';
import { Label } from '@/ui/label/Label';
import { SearchField } from '@/ui/searchField/SearchField';
import styles from './SearchFieldExample.module.css';

const SEARCH_LABEL = 'Search objects';
const CLEAR_LABEL = 'Clear search';
const PLACEHOLDER = 'Search';
const OBJECT_NAMES = ['Main Camera', 'Directional Light', 'Player', 'Enemy', 'Ground'];

export function SearchFieldExample() {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const matches = OBJECT_NAMES.filter((name) => name.toLowerCase().includes(normalizedQuery));

  return (
    <div className={styles.root}>
      <SearchField
        className={styles.field}
        label={SEARCH_LABEL}
        clearLabel={CLEAR_LABEL}
        placeholder={PLACEHOLDER}
        value={query}
        onValueChange={setQuery}
      />
      <ul className={styles.list}>
        {matches.map((name) => (
          <li key={name}>
            <Label>{name}</Label>
          </li>
        ))}
      </ul>
    </div>
  );
}
