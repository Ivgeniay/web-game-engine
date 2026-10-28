import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { startHotkeyController } from '@/core/hotkeys/hotkeyController';
import { detectPlatform } from '@/core/hotkeys/platform';
import { createLayoutStorage } from '@/layout/layoutPersistence';
import { startNativeContextMenuSuppression } from '@/shell/nativeContextMenu';
import { isKeyboardCapturedByPopup } from '@/shell/popupKeyboardCapture';
import { startLanguageController } from '@/state/language/languageController';
import { PlatformProvider } from '@/state/platform/PlatformProvider';
import { createEditorRegistries } from '@/state/registries/editorRegistries';
import { RegistriesProvider } from '@/state/registries/RegistriesProvider';
import { StoresProvider } from '@/state/stores/StoresProvider';
import { browserStorage, createBrowserStores } from '@/state/stores/browserStores';
import { startThemeController } from '@/state/theme/themeController';
import { PopupLayer } from '@/ui/popup/PopupLayer';
import { App } from './App';
import '@/themes/global.css';

const ROOT_ELEMENT_ID = 'root';

const rootElement = document.getElementById(ROOT_ELEMENT_ID);

if (rootElement === null) {
  throw new Error(`Element #${ROOT_ELEMENT_ID} not found`);
}

const stores = createBrowserStores();
const platform = detectPlatform(navigator);
const registries = createEditorRegistries();
const layoutStorage = createLayoutStorage(browserStorage);

startThemeController(stores.theme);
startLanguageController(stores.language, document.documentElement);
startNativeContextMenuSuppression(document);
startHotkeyController({
  commands: registries.commands,
  target: document,
  platform,
  areGlobalHotkeysBlocked: () => isKeyboardCapturedByPopup(document),
});

createRoot(rootElement).render(
  <StrictMode>
    <StoresProvider stores={stores}>
      <PlatformProvider platform={platform}>
        <RegistriesProvider registries={registries}>
          <PopupLayer>
            <App layoutStorage={layoutStorage} />
          </PopupLayer>
        </RegistriesProvider>
      </PlatformProvider>
    </StoresProvider>
  </StrictMode>,
);
