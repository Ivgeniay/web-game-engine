import { useSyncExternalStore } from 'react';
import type { CommandDefinition, CommandInvocation } from '@/core/commands/command';
import type { CommandRegistry } from '@/core/commands/commandRegistry';
import { commonMessages } from '@/core/i18n/commonMessages';
import { TOOLBAR_ZONES, toolbarZoneGroups } from '@/core/toolbar/toolbarRegistry';
import type { ToolbarItem, ToolbarZone } from '@/core/toolbar/toolbarRegistry';
import { useMessages } from '@/state/language/useMessages';
import { useTranslate } from '@/state/language/useTranslate';
import { useFormatShortcut } from '@/state/platform/useFormatShortcut';
import { useEditorRegistries } from '@/state/registries/registriesContext';
import { useCommandState } from '@/state/registries/useCommandState';
import { Button } from '@/ui/button/Button';
import { classNames } from '@/ui/classNames';
import { IconButton } from '@/ui/iconButton/IconButton';
import { Separator } from '@/ui/separator/Separator';
import { ToggleButton } from '@/ui/toggleButton/ToggleButton';
import { Toolbar } from '@/ui/toolbar/Toolbar';
import styles from './MainToolbar.module.css';

interface MainToolbarProps {
  readonly className?: string | undefined;
}

const FROM_TOOLBAR: CommandInvocation<undefined> = { source: 'toolbar', target: undefined };

function isVisible(item: ToolbarItem, commands: CommandRegistry): boolean {
  return item.kind === 'component' || commands.isHandled(item.command);
}

export function MainToolbar({ className }: MainToolbarProps) {
  const { toolbar, commands } = useEditorRegistries();
  const items = useSyncExternalStore(toolbar.subscribe, toolbar.getItems);
  useSyncExternalStore(commands.subscribe, commands.getVersion);
  const common = useMessages(commonMessages);

  return (
    <Toolbar label={common('toolbar')} className={classNames(styles.root, className)}>
      {TOOLBAR_ZONES.map((zone) => (
        <ToolbarZoneView
          key={zone}
          zone={zone}
          groups={toolbarZoneGroups(items, zone)
            .map((group) => group.filter((item) => isVisible(item, commands)))
            .filter((group) => group.length > 0)}
        />
      ))}
    </Toolbar>
  );
}

interface ToolbarZoneViewProps {
  readonly zone: ToolbarZone;
  readonly groups: readonly (readonly ToolbarItem[])[];
}

function ToolbarZoneView({ zone, groups }: ToolbarZoneViewProps) {
  return (
    <div className={classNames(styles.zone, styles[zone])}>
      {groups.map((group, index) => (
        <div key={group[0]?.id} className={styles.group}>
          {index > 0 && <Separator orientation="vertical" />}
          {group.map((item) => (
            <ToolbarItemView key={item.id} item={item} />
          ))}
        </div>
      ))}
    </div>
  );
}

interface ToolbarItemViewProps {
  readonly item: ToolbarItem;
}

function ToolbarItemView({ item }: ToolbarItemViewProps) {
  if (item.kind === 'component') {
    const Component = item.component;

    return <Component />;
  }

  return <ToolbarCommandButton command={item.command} />;
}

interface ToolbarCommandButtonProps {
  readonly command: CommandDefinition;
}

function ToolbarCommandButton({ command }: ToolbarCommandButtonProps) {
  const { commands } = useEditorRegistries();
  const translate = useTranslate();
  const formatShortcut = useFormatShortcut();
  const state = useCommandState(command, FROM_TOOLBAR);
  const label = translate(command.label);
  const disabled = !state.enabled;

  function execute(): void {
    commands.execute(command, FROM_TOOLBAR);
  }

  if (state.checked !== undefined) {
    return command.icon === undefined ? (
      <ToggleButton
        pressed={state.checked}
        onPressedChange={execute}
        disabled={disabled}
        focusableWhenDisabled
        variant="flat"
      >
        {label}
      </ToggleButton>
    ) : (
      <ToggleButton
        label={label}
        icon={command.icon}
        pressed={state.checked}
        onPressedChange={execute}
        disabled={disabled}
        focusableWhenDisabled
        variant="flat"
      />
    );
  }

  if (command.icon === undefined) {
    return (
      <Button variant="flat" disabled={disabled} focusableWhenDisabled onClick={execute}>
        {label}
      </Button>
    );
  }

  return (
    <IconButton
      label={label}
      icon={command.icon}
      shortcut={command.shortcut === undefined ? undefined : formatShortcut(command.shortcut.keys)}
      disabled={disabled}
      focusableWhenDisabled
      onClick={execute}
    />
  );
}
