import { commonMessages } from '@/core/i18n/commonMessages';
import { messageRef } from '@/core/i18n/translate';
import type { MessageRef } from '@/core/i18n/translate';
import { useTranslate } from '@/state/language/useTranslate';

interface PanelEntry {
  readonly id: string;
  readonly label: MessageRef;
}

const PANEL_ENTRIES: readonly PanelEntry[] = [
  { id: 'toolbar', label: messageRef(commonMessages, 'toolbar') },
  { id: 'status-bar', label: messageRef(commonMessages, 'statusBar') },
  { id: 'layout', label: messageRef(commonMessages, 'layout') },
];

export function MessageRefExample() {
  const translate = useTranslate();

  return (
    <ul>
      {PANEL_ENTRIES.map((entry) => (
        <li key={entry.id}>{translate(entry.label)}</li>
      ))}
    </ul>
  );
}
