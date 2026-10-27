import type { Language } from './languages';
import { COUNT_PARAM } from './messages';
import type { Messages, ParamValue, ParamsArgs, RuntimeMessage, SourceMessages } from './messages';

type RuntimeParams = Readonly<Record<string, ParamValue>>;

export interface MessageRef {
  readonly messages: Messages<SourceMessages>;
  readonly key: string;
  readonly params: RuntimeParams | undefined;
}

const PLACEHOLDER_PATTERN = /\{([^{}]+)\}/g;

function cachedPerLanguage<T>(create: (language: Language) => T): (language: Language) => T {
  const cache = new Map<Language, T>();

  return (language) => {
    const cached = cache.get(language);

    if (cached !== undefined) {
      return cached;
    }

    const created = create(language);
    cache.set(language, created);
    return created;
  };
}

const getPluralRules = cachedPerLanguage((language) => new Intl.PluralRules(language));

const getNumberFormat = cachedPerLanguage((language) => new Intl.NumberFormat(language));

function formatValue(value: ParamValue, language: Language): string {
  return typeof value === 'number' ? getNumberFormat(language).format(value) : value;
}

function interpolate(text: string, language: Language, params: RuntimeParams | undefined): string {
  return text.replace(PLACEHOLDER_PATTERN, (placeholder, name: string) => {
    const value = params?.[name];

    return value === undefined ? placeholder : formatValue(value, language);
  });
}

function selectText(
  entry: RuntimeMessage,
  key: string,
  language: Language,
  params: RuntimeParams | undefined,
): string {
  if (typeof entry === 'string') {
    return entry;
  }

  const count = params?.[COUNT_PARAM];

  if (typeof count !== 'number') {
    throw new Error(`Message "${key}" requires a numeric "${COUNT_PARAM}" parameter`);
  }

  const form = entry[getPluralRules(language).select(count)];

  if (form === undefined) {
    throw new Error(`Message "${key}" has no plural form for ${String(count)} in "${language}"`);
  }

  return form;
}

function translateEntry(
  messages: Messages<SourceMessages>,
  language: Language,
  key: string,
  params: RuntimeParams | undefined,
): string {
  const entry = messages.translations[language][key];

  if (entry === undefined) {
    throw new Error(`Message "${key}" is missing in "${language}"`);
  }

  return interpolate(selectText(entry, key, language, params), language, params);
}

export function translate<S extends SourceMessages, K extends keyof S & string>(
  messages: Messages<S>,
  language: Language,
  key: K,
  ...args: ParamsArgs<S[K]>
): string;
export function translate(
  messages: Messages<SourceMessages>,
  language: Language,
  key: string,
  params?: RuntimeParams,
): string {
  return translateEntry(messages, language, key, params);
}

export function messageRef<S extends SourceMessages, K extends keyof S & string>(
  messages: Messages<S>,
  key: K,
  ...args: ParamsArgs<S[K]>
): MessageRef;
export function messageRef(
  messages: Messages<SourceMessages>,
  key: string,
  params?: RuntimeParams,
): MessageRef {
  return { messages, key, params };
}

export function translateRef(ref: MessageRef, language: Language): string {
  return translateEntry(ref.messages, language, ref.key, ref.params);
}
