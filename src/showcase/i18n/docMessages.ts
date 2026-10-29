import type { Language, SourceLanguage } from '@/core/i18n/languages';
import type { Messages } from '@/core/i18n/messages';

export type DocSourceMessages = Readonly<Record<string, string>>;

export type DocDictionaryInput = Readonly<Record<Language, DocSourceMessages>>;

export type DocMessages<K extends string> = Messages<Readonly<Record<K, string>>>;

export type DocKey<D extends DocDictionaryInput> = keyof D[SourceLanguage] & string;

type WithoutCode<T extends string> = T extends `${infer Before}\`${string}\`${infer Rest}`
  ? `${Before}${WithoutCode<Rest>}`
  : T;

export type CodeSpans<T extends string> = T extends `${string}\`${infer Code}\`${infer Rest}`
  ? Code | CodeSpans<Rest>
  : never;

type LinkTargetsOf<T extends string> = T extends `${string}](${infer Target})${infer Rest}`
  ? Target | LinkTargetsOf<Rest>
  : never;

export type LinkTargets<T extends string> = LinkTargetsOf<WithoutCode<T>>;

type HasUnpairedCodeMark<T extends string> =
  WithoutCode<T> extends `${string}\`${string}` ? true : false;

type Mismatch<Problem extends string, Source, Translation> = [Source] extends [Translation]
  ? [Translation] extends [Source]
    ? never
    : Problem
  : Problem;

type DocTextProblem<Source extends string, Translation extends string> =
  HasUnpairedCodeMark<Translation> extends true
    ? 'Unpaired code mark'
    : | Mismatch<'Code spans differ from the source', CodeSpans<Source>, CodeSpans<Translation>>
      | Mismatch<'Links differ from the source', LinkTargets<Source>, LinkTargets<Translation>>;

type ValidateDocText<Source, Translation> = Source extends string
  ? Translation extends string
    ? [DocTextProblem<Source, Translation>] extends [never]
      ? Translation
      : { readonly documentationTextProblem: DocTextProblem<Source, Translation> }
    : string
  : never;

type ValidateDocTranslation<S, T> = {
  readonly [K in keyof S | keyof T]: K extends keyof S
    ? K extends keyof T
      ? ValidateDocText<S[K], T[K]>
      : ValidateDocText<S[K], S[K]>
    : never;
};

export type ValidateDocDictionary<D extends DocDictionaryInput> = {
  readonly [L in keyof D | Language]: L extends Language
    ? ValidateDocTranslation<D[SourceLanguage], D[L]>
    : never;
};

export function defineDocMessages<const D extends DocDictionaryInput>(
  dictionary: D & ValidateDocDictionary<D>,
): DocMessages<DocKey<D>> {
  return { translations: dictionary };
}
