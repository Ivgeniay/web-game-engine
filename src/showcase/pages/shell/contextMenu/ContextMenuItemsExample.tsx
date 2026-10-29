import { useMemo, useState } from 'react';
import { defineCommand } from '@/core/commands/command';
import type { EditorExtension } from '@/contracts/editorExtension';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import type { MessageRef } from '@/core/i18n/translate';
import { defineContextMenu } from '@/core/menus/contextMenuRegistry';
import { combineUnsubscribes } from '@/core/unsubscribe';
import { useContextMenuItems } from '@/shell/useContextMenuItems';
import { useMessages } from '@/state/language/useMessages';
import { useTranslate } from '@/state/language/useTranslate';
import { createEditorRegistries } from '@/state/registries/editorRegistries';
import { RegistriesProvider } from '@/state/registries/RegistriesProvider';
import { ComponentHeader } from '@/ui/componentHeader/ComponentHeader';
import { Label } from '@/ui/label/Label';
import styles from './ContextMenuItemsExample.module.css';

const inspectorMessages = defineMessages({
  en: {
    component: 'Component',
    reset: 'Reset',
    remove: 'Remove component',
    menu: '{component} menu',
    resetDone: 'Reset {component}',
    removed: 'Removed {component}',
    hint: 'Open the menu of the section',
  },
  ru: {
    component: 'Компонент',
    reset: 'Сбросить',
    remove: 'Удалить компонент',
    menu: 'Меню компонента {component}',
    resetDone: 'Сброшен {component}',
    removed: 'Удалён {component}',
    hint: 'Откройте меню секции',
  },
});

interface ComponentTarget {
  readonly component: string;
}

const RIGIDBODY = 'Rigidbody';
const TRANSFORM = 'Transform';

const componentMenu = defineContextMenu<ComponentTarget>({
  id: 'example.component',
  label: messageRef(inspectorMessages, 'component'),
});
const resetComponent = defineCommand<ComponentTarget>({
  id: 'example.resetComponent',
  label: messageRef(inspectorMessages, 'reset'),
});
const removeComponent = defineCommand<ComponentTarget>({
  id: 'example.removeComponent',
  label: messageRef(inspectorMessages, 'remove'),
});

function componentExtension(report: (action: MessageRef) => void): EditorExtension {
  return ({ contextMenus, commands }) =>
    combineUnsubscribes(
      contextMenus.registerItem(componentMenu, {
        path: 'reset',
        command: resetComponent,
        group: 0,
        order: 0,
      }),
      contextMenus.registerItem(componentMenu, {
        path: 'remove',
        command: removeComponent,
        group: 10,
        order: 0,
      }),
      commands.handle(resetComponent, {
        run: ({ target }) => {
          report(messageRef(inspectorMessages, 'resetDone', { component: target.component }));
        },
      }),
      commands.handle(removeComponent, {
        run: ({ target }) => {
          report(messageRef(inspectorMessages, 'removed', { component: target.component }));
        },
        isEnabled: ({ target }) => target.component !== TRANSFORM,
      }),
    );
}

interface SectionProps {
  readonly component: string;
}

function Section({ component }: SectionProps) {
  const t = useMessages(inspectorMessages);
  const [expanded, setExpanded] = useState(false);
  const target = useMemo(() => ({ component }), [component]);
  const menuItems = useContextMenuItems(componentMenu, target);

  return (
    <ComponentHeader
      title={component}
      expanded={expanded}
      onExpandedChange={setExpanded}
      menuItems={menuItems}
      menuLabel={t('menu', { component })}
    >
      {null}
    </ComponentHeader>
  );
}

interface ActionHintProps {
  readonly action: MessageRef | null;
}

function ActionHint({ action }: ActionHintProps) {
  const t = useMessages(inspectorMessages);
  const translate = useTranslate();

  return <Label tone="secondary">{action === null ? t('hint') : translate(action)}</Label>;
}

export function ContextMenuItemsExample() {
  const [action, setAction] = useState<MessageRef | null>(null);
  const [editor] = useState(() => {
    const registries = createEditorRegistries();
    componentExtension(setAction)(registries);

    return registries;
  });

  return (
    <RegistriesProvider registries={editor}>
      <div className={styles.root}>
        <Section component={TRANSFORM} />
        <Section component={RIGIDBODY} />
        <ActionHint action={action} />
      </div>
    </RegistriesProvider>
  );
}
