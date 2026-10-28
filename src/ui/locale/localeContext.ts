import { createContext } from 'react';

export const DEFAULT_LOCALE = 'en';

export const LocaleContext = createContext<string>(DEFAULT_LOCALE);
