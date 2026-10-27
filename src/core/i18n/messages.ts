import type { Language, PluralCategory, SourceLanguage, TranslationLanguage } from './languages';

export const COUNT_PARAM = 'count';

export type CountParam = typeof COUNT_PARAM;

export type PluralForms<L extends Language> = { readonly [C in PluralCategory<L>]: string };

export type SourceMessage = string | PluralForms<SourceLanguage>;

export type SourceMessages = Readonly<Record<string, SourceMessage>>;

export type RuntimeMessage = string | Readonly<Partial<Record<Intl.LDMLPluralRule, string>>>;

export type RuntimeMessages = Readonly<Record<string, RuntimeMessage>>;

export type DictionaryInput = Readonly<Record<Language, RuntimeMessages>> & {
  readonly en: SourceMessages;
};

export interface Messages<S extends SourceMessages> {
  readonly translations: { readonly en: S } & Readonly<
    Record<TranslationLanguage, RuntimeMessages>
  >;
}

export type Placeholders<T extends string> = T extends `${string}{${infer Name}}${infer Rest}`
  ? Name | Placeholders<Rest>
  : never;

type PluralPlaceholders<M extends PluralForms<SourceLanguage>> = Placeholders<
  M[PluralCategory<SourceLanguage>]
>;

export type ParamValue = string | number;

export type MessageParams<M extends SourceMessage> = M extends string
  ? { readonly [N in Placeholders<M>]: ParamValue }
  : M extends PluralForms<SourceLanguage>
    ? {
        readonly [N in PluralPlaceholders<M> | CountParam]: N extends CountParam
          ? number
          : ParamValue;
      }
    : never;

export type ParamsArgs<M extends SourceMessage> = [keyof MessageParams<M>] extends [never]
  ? []
  : [params: MessageParams<M>];

type AllowedPlaceholders<M> = M extends string
  ? Placeholders<M>
  : M extends PluralForms<SourceLanguage>
    ? PluralPlaceholders<M> | CountParam
    : never;

type ValidateText<T, Allowed extends string> = T extends string
  ? [Exclude<Placeholders<T>, Allowed>] extends [never]
    ? T
    : `Unknown placeholder: {${Exclude<Placeholders<T>, Allowed>}}`
  : string;

type ValidatePluralForms<T, Allowed extends string, L extends Language> = T extends string
  ? PluralForms<L>
  : {
      readonly [C in PluralCategory<L> | keyof T]: C extends PluralCategory<L>
        ? C extends keyof T
          ? ValidateText<T[C], Allowed>
          : string
        : never;
    };

type ValidateEntry<M, T, L extends Language> = M extends string
  ? ValidateText<T, AllowedPlaceholders<M>>
  : ValidatePluralForms<T, AllowedPlaceholders<M>, L>;

type ValidateTranslation<S, T, L extends Language> = {
  readonly [K in keyof S | keyof T]: K extends keyof S
    ? K extends keyof T
      ? ValidateEntry<S[K], T[K], L>
      : ValidateEntry<S[K], S[K], L>
    : never;
};

export type ValidateDictionary<D extends DictionaryInput> = {
  readonly [L in keyof D | Language]: L extends Language
    ? ValidateTranslation<D[SourceLanguage], D[L], L>
    : never;
};

export function defineMessages<const D extends DictionaryInput>(
  dictionary: D & ValidateDictionary<D>,
): Messages<D[SourceLanguage]> {
  return { translations: dictionary };
}
