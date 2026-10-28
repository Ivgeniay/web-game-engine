import { useId, useState } from 'react';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { Button } from '@/ui/button/Button';
import { Checkbox } from '@/ui/checkbox/Checkbox';
import { Dialog } from '@/ui/dialog/Dialog';
import { IconButton } from '@/ui/iconButton/IconButton';
import { Label } from '@/ui/label/Label';
import { Select } from '@/ui/select/Select';
import type { SelectEntry } from '@/ui/select/selectOptions';
import styles from './DialogFormExample.module.css';

type Shader = 'lit' | 'unlit' | 'toon';

const OPEN_LABEL = 'New material…';
const TITLE = 'Create material';
const DESCRIPTION = 'The material is added to the current folder of the project.';
const SHADER_LABEL = 'Shader';
const SHADER_HELP = 'About shaders';
const SHADER_RESET = 'Reset to default';
const SHADOWS_LABEL = 'Receive shadows';
const CANCEL_LABEL = 'Cancel';
const CREATE_LABEL = 'Create';
const NOTHING_CREATED = 'No material created yet';
const CREATED_PREFIX = 'Created a material with the shader ';

const SHADER_OPTIONS: readonly SelectEntry<Shader>[] = [
  { kind: 'option', value: 'lit', label: 'Lit' },
  { kind: 'option', value: 'unlit', label: 'Unlit' },
  { kind: 'option', value: 'toon', label: 'Toon' },
];

const DEFAULT_SHADER: Shader = 'lit';

export function DialogFormExample() {
  const shaderLabelId = useId();
  const [open, setOpen] = useState(false);
  const [shader, setShader] = useState<Shader>(DEFAULT_SHADER);
  const [receiveShadows, setReceiveShadows] = useState(true);
  const [result, setResult] = useState(NOTHING_CREATED);

  function close() {
    setOpen(false);
  }

  return (
    <div className={styles.root}>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        {OPEN_LABEL}
      </Button>
      <Label tone="secondary">{result}</Label>
      <Dialog
        open={open}
        onClose={close}
        title={TITLE}
        description={DESCRIPTION}
        onSubmit={() => {
          setResult(`${CREATED_PREFIX}${shader}`);
          close();
        }}
        actions={
          <>
            <Button onClick={close}>{CANCEL_LABEL}</Button>
            <Button type="submit" variant="accent">
              {CREATE_LABEL}
            </Button>
          </>
        }
      >
        <div className={styles.row}>
          <Label id={shaderLabelId}>{SHADER_LABEL}</Label>
          <Select
            aria-labelledby={shaderLabelId}
            options={SHADER_OPTIONS}
            value={shader}
            onValueChange={setShader}
          />
          <IconButton
            label={SHADER_RESET}
            icon={frameworkIcons.reset}
            onClick={() => {
              setShader(DEFAULT_SHADER);
            }}
          />
          <IconButton label={SHADER_HELP} icon={frameworkIcons.help} shortcut="F1" />
        </div>
        <Checkbox
          checked={receiveShadows}
          onCheckedChange={setReceiveShadows}
          label={SHADOWS_LABEL}
        />
      </Dialog>
    </div>
  );
}
