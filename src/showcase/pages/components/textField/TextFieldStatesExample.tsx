import { useState } from 'react';
import { TextField } from '@/ui/textField/TextField';
import styles from './TextFieldStatesExample.module.css';

const READ_ONLY_LABEL = 'Asset path';
const DISABLED_LABEL = 'Prefab name';
const MIXED_LABEL = 'Name of selected objects';
const PASSWORD_LABEL = 'Access token';
const ASSET_PATH = 'Assets/Scenes/Main.scene';

export function TextFieldStatesExample() {
  const [mixedName, setMixedName] = useState('Cube');
  const [mixed, setMixed] = useState(true);
  const [token, setToken] = useState('secret');

  return (
    <div className={styles.root}>
      <TextField
        aria-label={READ_ONLY_LABEL}
        className={styles.field}
        value={ASSET_PATH}
        readOnly
      />
      <TextField aria-label={DISABLED_LABEL} className={styles.field} value="Enemy" disabled />
      <TextField
        aria-label={MIXED_LABEL}
        className={styles.field}
        value={mixedName}
        mixed={mixed}
        onValueChange={(value) => {
          setMixedName(value);
          setMixed(false);
        }}
      />
      <TextField
        aria-label={PASSWORD_LABEL}
        className={styles.field}
        type="password"
        value={token}
        onValueChange={setToken}
      />
    </div>
  );
}
