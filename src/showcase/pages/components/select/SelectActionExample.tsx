import { useState } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { Select } from '@/ui/select/Select';
import type { SelectEntry } from '@/ui/select/selectOptions';
import styles from './SelectActionExample.module.css';

const FIELD_LABEL = 'Tag';
const PLACEHOLDER = 'Untagged';
const ADD_LABEL = 'Add tag…';
const NEW_TAG_PREFIX = 'Tag ';

export function SelectActionExample() {
  const [tags, setTags] = useState<readonly string[]>(['Player', 'Enemy', 'Pickup']);
  const [tag, setTag] = useState<string | null>(null);

  const options: readonly SelectEntry<string>[] = tags.map((name) => ({
    kind: 'option',
    value: name,
    label: name,
  }));

  return (
    <div className={styles.root}>
      <Select
        aria-label={FIELD_LABEL}
        options={options}
        value={tag}
        placeholder={PLACEHOLDER}
        onValueChange={setTag}
        action={{
          label: ADD_LABEL,
          icon: frameworkIcons.plus,
          onSelect: () => {
            const name = `${NEW_TAG_PREFIX}${String(tags.length + 1)}`;
            setTags([...tags, name]);
            setTag(name);
          },
        }}
      />
    </div>
  );
}
