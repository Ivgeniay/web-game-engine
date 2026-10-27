import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { startThemeController } from '@/state/theme/themeController';
import { App } from './App';
import './global.css';

const ROOT_ELEMENT_ID = 'root';

const rootElement = document.getElementById(ROOT_ELEMENT_ID);

if (rootElement === null) {
  throw new Error(`Element #${ROOT_ELEMENT_ID} not found`);
}

startThemeController();

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
