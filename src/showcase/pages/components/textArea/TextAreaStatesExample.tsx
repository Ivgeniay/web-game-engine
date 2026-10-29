import { useState } from 'react';
import { TextArea } from '@/ui/textArea/TextArea';
import styles from './TextAreaStatesExample.module.css';

const REQUIRED_LABEL = 'Description';
const MIXED_LABEL = 'Notes of selected objects';
const READ_ONLY_LABEL = 'Import log';
const REQUIRED_MESSAGE = 'Description is required';
const IMPORT_LOG = 'Imported 3 meshes.\nSkipped 1 material.';

function requireText(text: string): string | undefined {
  return text.trim() === '' ? REQUIRED_MESSAGE : undefined;
}

export function TextAreaStatesExample() {
  const [description, setDescription] = useState('A wooden crate.');
  const [notes, setNotes] = useState('');
  const [mixed, setMixed] = useState(true);

  return (
    <div className={styles.root}>
      <TextArea
        aria-label={REQUIRED_LABEL}
        className={styles.field}
        value={description}
        validate={requireText}
        onValueChange={setDescription}
      />
      <TextArea
        aria-label={MIXED_LABEL}
        className={styles.field}
        value={notes}
        mixed={mixed}
        onValueChange={(value) => {
          setNotes(value);
          setMixed(false);
        }}
      />
      <TextArea aria-label={READ_ONLY_LABEL} className={styles.field} value={IMPORT_LOG} readOnly />
    </div>
  );
}
