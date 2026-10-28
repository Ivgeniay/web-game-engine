import type { ReactNode } from 'react';
import { PlatformProvider } from '@/state/platform/PlatformProvider';
import { RegistriesProvider } from '@/state/registries/RegistriesProvider';
import { StoresProvider } from '@/state/stores/StoresProvider';
import type { TestEditor } from './testEditor';

interface TestEditorProvidersProps {
  readonly editor: TestEditor;
  readonly children: ReactNode;
}

export function TestEditorProviders({ editor, children }: TestEditorProvidersProps) {
  return (
    <StoresProvider stores={editor.stores}>
      <PlatformProvider platform={editor.platform}>
        <RegistriesProvider registries={editor.registries}>{children}</RegistriesProvider>
      </PlatformProvider>
    </StoresProvider>
  );
}
