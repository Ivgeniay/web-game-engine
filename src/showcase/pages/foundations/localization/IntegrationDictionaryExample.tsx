import { commonMessages } from '@/core/i18n/commonMessages';
import { defineMessages } from '@/core/i18n/messages';
import { useMessages } from '@/state/language/useMessages';

const SCRIPT_COUNT = 3;

const engineMessages = defineMessages({
  en: {
    playScene: 'Play scene',
    compiling: { one: 'Compiling {count} script', other: 'Compiling {count} scripts' },
  },
  ru: {
    playScene: 'Запустить сцену',
    compiling: {
      one: 'Компилируется {count} скрипт',
      few: 'Компилируются {count} скрипта',
      many: 'Компилируются {count} скриптов',
      other: 'Компилируются {count} скрипта',
    },
  },
});

export function IntegrationDictionaryExample() {
  const common = useMessages(commonMessages);
  const engine = useMessages(engineMessages);

  return (
    <ul>
      <li>{engine('playScene')}</li>
      <li>{engine('compiling', { count: SCRIPT_COUNT })}</li>
      <li>{common('cancel')}</li>
    </ul>
  );
}
