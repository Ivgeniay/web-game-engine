import { messageRef } from '@/core/i18n/translate';
import { demoMessages } from '@/demo/demoMessages';
import { DEFAULT_NOTE } from '@/demo/scene/sceneStore';
import type { SceneObject } from '@/demo/scene/sceneStore';
import { useMessages } from '@/state/language/useMessages';
import { ComponentSection } from './ComponentSection';
import { TextAreaPropertyRow } from './TextAreaPropertyRow';

interface NoteSectionProps {
  readonly objects: readonly SceneObject[];
  readonly expanded: boolean;
  readonly onExpandedChange: (expanded: boolean) => void;
}

export function NoteSection({ objects, expanded, onExpandedChange }: NoteSectionProps) {
  const t = useMessages(demoMessages);

  return (
    <ComponentSection
      component="note"
      title={t('note')}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
    >
      <TextAreaPropertyRow
        objects={objects}
        label={t('noteText')}
        undoLabel={messageRef(demoMessages, 'note')}
        get={(object) => (object.note ?? DEFAULT_NOTE).text}
        set={(object, text) => (object.note === null ? object : { ...object, note: { text } })}
      />
    </ComponentSection>
  );
}
