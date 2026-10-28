import { act, cleanup, render, renderHook, screen } from '@testing-library/react';
import { StrictMode } from 'react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineCommand } from '@/core/commands/command';
import type { CommandInvocation } from '@/core/commands/command';
import { defineMessages } from '@/core/i18n/messages';
import { messageRef } from '@/core/i18n/translate';
import { createEditorRegistries } from './editorRegistries';
import type { EditorRegistries } from './editorRegistries';
import { RegistriesProvider } from './RegistriesProvider';
import { useEditorRegistries } from './registriesContext';
import { useCommandState } from './useCommandState';
import { useRegistration } from './useRegistration';

const messages = defineMessages({
  en: { lock: 'Lock' },
  ru: { lock: 'Закрепить' },
});

const lockInspector = defineCommand({ id: 'inspector.lock', label: messageRef(messages, 'lock') });

const FROM_MENU: CommandInvocation<undefined> = { source: 'menu', target: undefined };
const ENABLED_TEXT = 'enabled';
const DISABLED_TEXT = 'disabled';

interface LockHandlerProps {
  readonly enabled: boolean;
  readonly run?: () => void;
}

function LockHandler({ enabled, run = vi.fn() }: LockHandlerProps) {
  useRegistration(
    (editor) => editor.commands.handle(lockInspector, { run, isEnabled: () => enabled }),
    [enabled, run],
  );

  return null;
}

function LockState() {
  const state = useCommandState(lockInspector, FROM_MENU);

  return <span>{state.enabled ? ENABLED_TEXT : DISABLED_TEXT}</span>;
}

function renderWith(registries: EditorRegistries, children: ReactNode) {
  return render(<RegistriesProvider registries={registries}>{children}</RegistriesProvider>);
}

function isHandled(registries: EditorRegistries): boolean {
  return registries.commands.getState(lockInspector, FROM_MENU).handled;
}

afterEach(() => {
  cleanup();
});

describe('useRegistration', () => {
  it('registers while the component is mounted', () => {
    const registries = createEditorRegistries();
    const { unmount } = renderWith(registries, <LockHandler enabled />);

    expect(isHandled(registries)).toBe(true);

    unmount();

    expect(isHandled(registries)).toBe(false);
  });

  it('survives the double effects of StrictMode without a duplicate', () => {
    const registries = createEditorRegistries();

    renderWith(
      registries,
      <StrictMode>
        <LockHandler enabled />
      </StrictMode>,
    );

    expect(registries.commands.getHandledCommands()).toHaveLength(1);
  });

  it('registers again when a dependency changes', () => {
    const registries = createEditorRegistries();
    const { rerender } = renderWith(registries, <LockHandler enabled />);

    rerender(
      <RegistriesProvider registries={registries}>
        <LockHandler enabled={false} />
      </RegistriesProvider>,
    );

    expect(registries.commands.getState(lockInspector, FROM_MENU).enabled).toBe(false);
  });

  it('keeps the registration while the dependencies stay the same', () => {
    const registries = createEditorRegistries();
    const run = vi.fn();
    const { rerender } = renderWith(registries, <LockHandler enabled run={run} />);
    const listener = vi.fn();
    registries.commands.subscribe(listener);

    rerender(
      <RegistriesProvider registries={registries}>
        <LockHandler enabled run={run} />
      </RegistriesProvider>,
    );

    expect(listener).not.toHaveBeenCalled();
  });

  it('moves the registration to other registries', () => {
    const first = createEditorRegistries();
    const second = createEditorRegistries();
    const run = vi.fn();
    const { rerender } = renderWith(first, <LockHandler enabled run={run} />);

    rerender(
      <RegistriesProvider registries={second}>
        <LockHandler enabled run={run} />
      </RegistriesProvider>,
    );

    expect(isHandled(first)).toBe(false);
    expect(isHandled(second)).toBe(true);
  });

  it('runs the handler of the current registration', () => {
    const registries = createEditorRegistries();
    const run = vi.fn();
    renderWith(registries, <LockHandler enabled run={run} />);

    registries.commands.execute(lockInspector, FROM_MENU);

    expect(run).toHaveBeenCalledTimes(1);
  });
});

describe('useCommandState', () => {
  it('follows handlers that come and go with components', () => {
    const registries = createEditorRegistries();
    const { rerender } = renderWith(
      registries,
      <>
        <LockState />
        <LockHandler enabled />
      </>,
    );

    expect(screen.getByText(ENABLED_TEXT)).toBeDefined();

    rerender(
      <RegistriesProvider registries={registries}>
        <LockState />
      </RegistriesProvider>,
    );

    expect(screen.getByText(DISABLED_TEXT)).toBeDefined();
  });

  it('evaluates the state again on refresh', () => {
    const registries = createEditorRegistries();
    let enabled = false;
    registries.commands.handle(lockInspector, { run: vi.fn(), isEnabled: () => enabled });
    renderWith(registries, <LockState />);

    enabled = true;
    act(() => {
      registries.commands.refresh();
    });

    expect(screen.getByText(ENABLED_TEXT)).toBeDefined();
  });
});

describe('useEditorRegistries', () => {
  it('throws without a provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => renderHook(() => useEditorRegistries())).toThrow(
      'Editor registries are not provided.',
    );

    vi.restoreAllMocks();
  });
});
