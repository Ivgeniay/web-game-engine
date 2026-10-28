import { useState } from 'react';
import { TextField } from '@/ui/textField/TextField';
import styles from './TextFieldValidationExample.module.css';

const FIELD_LABEL = 'Object name';
const EMPTY_NAME_MESSAGE = 'The name cannot be empty';
const SLASH = '/';
const SLASH_MESSAGE = 'The name cannot contain a slash';

function validateName(name: string): string | undefined {
  if (name.trim() === '') {
    return EMPTY_NAME_MESSAGE;
  }

  return name.includes(SLASH) ? SLASH_MESSAGE : undefined;
}

export function TextFieldValidationExample() {
  const [name, setName] = useState('Directional Light');

  return (
    <TextField
      aria-label={FIELD_LABEL}
      className={styles.field}
      value={name}
      validate={validateName}
      onValueChange={setName}
    />
  );
}
