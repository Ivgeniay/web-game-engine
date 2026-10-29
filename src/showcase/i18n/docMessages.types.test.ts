import { describe, expectTypeOf, it } from 'vitest';
import type { ParamsArgs } from '@/core/i18n/messages';
import { messageRef, translate } from '@/core/i18n/translate';
import { defineDocMessages } from './docMessages';
import type { CodeSpans, LinkTargets, ValidateDocDictionary } from './docMessages';

const messages = defineDocMessages({
  en: {
    title: 'Rows',
    rows: 'Pass `children({ id, labelId })` to `PropertyRow`.',
  },
  ru: {
    title: 'Строки',
    rows: 'Передайте в `PropertyRow` функцию `children({ id, labelId })`.',
  },
});

type SourceOf<M> = M extends { readonly translations: { readonly en: infer S } } ? S : never;

const validDictionary = {
  en: { text: 'Use `Icon`, see [Icons](foundations/icons) and **why**.' },
  ru: { text: 'См. [Иконки](foundations/icons): используйте `Icon` и **почему**.' },
} as const;

const missingKey = {
  en: { title: 'Title', text: 'Text' },
  ru: { title: 'Заголовок' },
} as const;

const extraKey = {
  en: { title: 'Title' },
  ru: { title: 'Заголовок', text: 'Текст' },
} as const;

const missingCode = {
  en: { text: 'Use `Icon` and `iconRef`.' },
  ru: { text: 'Используйте `Icon`.' },
} as const;

const extraCode = {
  en: { text: 'Use `Icon`.' },
  ru: { text: 'Используйте `Icon` и `iconRef`.' },
} as const;

const changedCode = {
  en: { text: 'Use `useMessages`.' },
  ru: { text: 'Используйте `useMesages`.' },
} as const;

const unpairedTranslationCode = {
  en: { text: 'Use `Icon`.' },
  ru: { text: 'Используйте `Icon` и `.' },
} as const;

const unpairedSourceCode = {
  en: { text: 'Use `Icon.' },
  ru: { text: 'Используйте `Icon.' },
} as const;

const changedLink = {
  en: { text: 'See [Icons](foundations/icons).' },
  ru: { text: 'См. [Иконки](foundations/colors).' },
} as const;

const missingLink = {
  en: { text: 'See [Icons](foundations/icons).' },
  ru: { text: 'См. страницу «Иконки».' },
} as const;

describe('documentation message types', () => {
  it('extracts every code span of a text', () => {
    expectTypeOf<CodeSpans<'`a` and `b({ c })`, `a`'>>().toEqualTypeOf<'a' | 'b({ c })'>();
    expectTypeOf<CodeSpans<'No code'>>().toEqualTypeOf<never>();
  });

  it('extracts link targets outside code spans', () => {
    expectTypeOf<
      LinkTargets<'[A](overview) and `[b](not-a-link)` [`C`](shell/undo)'>
    >().toEqualTypeOf<'overview' | 'shell/undo'>();
  });

  it('keeps braces inside code from requiring parameters', () => {
    expectTypeOf<ParamsArgs<SourceOf<typeof messages>['rows']>>().toEqualTypeOf<[]>();
    expectTypeOf(translate(messages, 'ru', 'rows')).toEqualTypeOf<string>();
    expectTypeOf(messageRef(messages, 'rows')).toEqualTypeOf(messageRef(messages, 'title'));
  });

  it('accepts a translation with the same code and links in another order', () => {
    expectTypeOf(validDictionary).toExtend<ValidateDocDictionary<typeof validDictionary>>();
  });

  it('rejects a translation without a source key', () => {
    expectTypeOf(missingKey).not.toExtend<ValidateDocDictionary<typeof missingKey>>();
  });

  it('rejects a translation with a key missing from the source', () => {
    expectTypeOf(extraKey).not.toExtend<ValidateDocDictionary<typeof extraKey>>();
  });

  it('rejects a translation without a code span of the source', () => {
    expectTypeOf(missingCode).not.toExtend<ValidateDocDictionary<typeof missingCode>>();
  });

  it('rejects a translation with a code span missing from the source', () => {
    expectTypeOf(extraCode).not.toExtend<ValidateDocDictionary<typeof extraCode>>();
  });

  it('rejects a translation with a misspelled code span', () => {
    expectTypeOf(changedCode).not.toExtend<ValidateDocDictionary<typeof changedCode>>();
  });

  it('rejects an unpaired code mark in a translation', () => {
    expectTypeOf(unpairedTranslationCode).not.toExtend<
      ValidateDocDictionary<typeof unpairedTranslationCode>
    >();
  });

  it('rejects an unpaired code mark in the source', () => {
    expectTypeOf(unpairedSourceCode).not.toExtend<
      ValidateDocDictionary<typeof unpairedSourceCode>
    >();
  });

  it('rejects a link to another page', () => {
    expectTypeOf(changedLink).not.toExtend<ValidateDocDictionary<typeof changedLink>>();
  });

  it('rejects a translation without a link of the source', () => {
    expectTypeOf(missingLink).not.toExtend<ValidateDocDictionary<typeof missingLink>>();
  });
});
