import { useState } from 'react';
import type { UndoOperation } from '@/contracts/undo';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { createUndoStack } from '@/core/undo/undoStack';
import { useMessages } from '@/state/language/useMessages';
import { Button } from '@/ui/button/Button';
import { Label } from '@/ui/label/Label';
import styles from './UndoGroupExample.module.css';

const sceneMessages = defineMessages({
  en: {
    move: 'Move objects',
    moveObject: 'Move object',
    undo: 'Undo',
    positions: 'Positions: {positions}',
  },
  ru: {
    move: 'Сдвинуть объекты',
    moveObject: 'Сдвинуть объект',
    undo: 'Отменить',
    positions: 'Позиции: {positions}',
  },
});

const OBJECT_COUNT = 3;
const MOVE_DISTANCE = 1;
const POSITION_SEPARATOR = ', ';

export function UndoGroupExample() {
  const t = useMessages(sceneMessages);
  const [undo] = useState(() => createUndoStack());
  const [positions, setPositions] = useState<readonly number[]>(() =>
    Array.from({ length: OBJECT_COUNT }, () => 0),
  );
  const [canUndo, setCanUndo] = useState(false);

  function moveObject(index: number): UndoOperation {
    const shift = (delta: number) => {
      setPositions((current) =>
        current.map((position, item) => (item === index ? position + delta : position)),
      );
    };
    shift(MOVE_DISTANCE);

    return {
      label: messageRef(sceneMessages, 'moveObject'),
      undo: () => {
        shift(-MOVE_DISTANCE);
      },
      redo: () => {
        shift(MOVE_DISTANCE);
      },
    };
  }

  return (
    <div className={styles.root}>
      <Label>{t('positions', { positions: positions.join(POSITION_SEPARATOR) })}</Label>
      <div className={styles.actions}>
        <Button
          onClick={() => {
            undo.group(messageRef(sceneMessages, 'move'), () => {
              positions.forEach((_, index) => {
                undo.push(moveObject(index));
              });
            });
            setCanUndo(undo.canUndo());
          }}
        >
          {t('move')}
        </Button>
        <Button
          disabled={!canUndo}
          onClick={() => {
            undo.undo();
            setCanUndo(undo.canUndo());
          }}
        >
          {t('undo')}
        </Button>
      </div>
    </div>
  );
}
