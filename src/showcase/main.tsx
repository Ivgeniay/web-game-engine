import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { detectPlatform } from '@/core/hotkeys/platform';
import { startLanguageController } from '@/state/language/languageController';
import { PlatformProvider } from '@/state/platform/PlatformProvider';
import { StoresProvider } from '@/state/stores/StoresProvider';
import { createBrowserStores } from '@/state/stores/browserStores';
import { startThemeController } from '@/state/theme/themeController';
import { DragAndDropLayer } from '@/ui/dragAndDrop/DragAndDropLayer';
import { PopupLayer } from '@/ui/popup/PopupLayer';
import '@/themes/global.css';
import './showcase.css';
import { Showcase } from './Showcase';

const ROOT_ELEMENT_ID = 'root';

const rootElement = document.getElementById(ROOT_ELEMENT_ID);

if (rootElement === null) {
  throw new Error(`Element #${ROOT_ELEMENT_ID} not found`);
}

const stores = createBrowserStores();
const platform = detectPlatform(navigator);

startThemeController(stores.theme);
startLanguageController(stores.language, document.documentElement);

createRoot(rootElement).render(
  <StrictMode>
    <StoresProvider stores={stores}>
      <PlatformProvider platform={platform}>
        <PopupLayer>
          <DragAndDropLayer>
            <Showcase />
          </DragAndDropLayer>
        </PopupLayer>
      </PlatformProvider>
    </StoresProvider>
  </StrictMode>,
);
