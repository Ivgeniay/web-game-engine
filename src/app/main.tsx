import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { startLanguageController } from '@/state/language/languageController';
import { StoresProvider } from '@/state/stores/StoresProvider';
import { createBrowserStores } from '@/state/stores/browserStores';
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

startThemeController(stores.theme);
startLanguageController(stores.language, document.documentElement);

createRoot(rootElement).render(
  <StrictMode>
    <StoresProvider stores={stores}>
      <PopupLayer>
        <App />
      </PopupLayer>
    </StoresProvider>
  </StrictMode>,
);
