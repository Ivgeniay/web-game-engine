import { describe, expectTypeOf, it } from 'vitest';
import { defineMessages } from './messages';
import type { DictionaryInput, ParamsArgs, Placeholders, ValidateDictionary } from './messages';
import { messageRef, translate } from './translate';

const messages = defineMessages({
  en: {
    resetLayout: 'Reset layout',
    greeting: 'Hello, {name}! You have {count} tabs',
    objects: { one: 'One object in {scene}', other: '{count} objects in {scene}' },
  },
  ru: {
    resetLayout: 'Сбросить раскладку',
    greeting: 'Привет, {name}! Открыто вкладок: {count}',
    objects: {
      one: '{count} объект в {scene}',
      few: '{count} объекта в {scene}',
      many: '{count} объектов в {scene}',
      other: '{count} объекта в {scene}',
    },
  },
});

type SourceOf<M> = M extends { readonly translations: { readonly en: infer S } } ? S : never;

type Source = SourceOf<typeof messages>;

const validDictionary = {
  en: { label: 'Label {name}', items: { one: 'item', other: 'items' } },
  ru: { label: 'Метка {name}', items: { one: 'а', few: 'б', many: 'в', other: 'г' } },
} as const;

const missingKey = {
  en: { label: 'Label', title: 'Title' },
  ru: { label: 'Метка' },
} as const;

const extraKey = {
  en: { label: 'Label' },
  ru: { label: 'Метка', title: 'Заголовок' },
} as const;

const missingRussianForm = {
  en: { items: { one: 'item', other: 'items' } },
  ru: { items: { one: 'а', many: 'в', other: 'г' } },
} as const;

const extraRussianForm = {
  en: { items: { one: 'item', other: 'items' } },
  ru: { items: { zero: 'н', one: 'а', few: 'б', many: 'в', other: 'г' } },
} as const;

const missingEnglishForm = {
  en: { items: { one: 'item' } },
  ru: { items: { one: 'а', few: 'б', many: 'в', other: 'г' } },
} as const;

const unknownPlaceholder = {
  en: { label: 'Label {name}' },
  ru: { label: 'Метка {title}' },
} as const;

const pluralInsteadOfText = {
  en: { label: 'Label' },
  ru: { label: { one: 'а', few: 'б', many: 'в', other: 'г' } },
} as const;

describe('message types', () => {
  it('extracts every placeholder of a template', () => {
    expectTypeOf<Placeholders<'{a} and {b}, {a}'>>().toEqualTypeOf<'a' | 'b'>();
    expectTypeOf<Placeholders<'No placeholders'>>().toEqualTypeOf<never>();
  });

  it('accepts only the keys of the dictionary', () => {
    expectTypeOf(translate<Source, 'resetLayout'>)
      .parameter(2)
      .toEqualTypeOf<'resetLayout'>();
    expectTypeOf<keyof Source>().toEqualTypeOf<'resetLayout' | 'greeting' | 'objects'>();
  });

  it('forbids parameters for a message without placeholders', () => {
    expectTypeOf<ParamsArgs<Source['resetLayout']>>().toEqualTypeOf<[]>();
  });

  it('requires every placeholder of a text message', () => {
    expectTypeOf<ParamsArgs<Source['greeting']>>().toEqualTypeOf<
      [params: { readonly name: string | number; readonly count: string | number }]
    >();
  });

  it('requires a numeric count and the placeholders of all forms for a plural message', () => {
    expectTypeOf<ParamsArgs<Source['objects']>>().toEqualTypeOf<
      [params: { readonly scene: string | number; readonly count: number }]
    >();
  });

  it('accepts a dictionary whose translations match the source', () => {
    expectTypeOf(validDictionary).toExtend<ValidateDictionary<typeof validDictionary>>();
  });

  it('rejects a translation without a source key', () => {
    expectTypeOf(missingKey).not.toExtend<ValidateDictionary<typeof missingKey>>();
  });

  it('rejects a translation with a key missing from the source', () => {
    expectTypeOf(extraKey).not.toExtend<ValidateDictionary<typeof extraKey>>();
  });

  it('rejects a Russian plural message without a required form', () => {
    expectTypeOf(missingRussianForm).not.toExtend<ValidateDictionary<typeof missingRussianForm>>();
  });

  it('rejects a plural form the language does not have', () => {
    expectTypeOf(extraRussianForm).not.toExtend<ValidateDictionary<typeof extraRussianForm>>();
  });

  it('rejects an English plural message without a required form', () => {
    expectTypeOf(missingEnglishForm).not.toExtend<DictionaryInput>();
  });

  it('rejects a placeholder missing from the source', () => {
    expectTypeOf(unknownPlaceholder).not.toExtend<ValidateDictionary<typeof unknownPlaceholder>>();
  });

  it('rejects a plural translation of a text message', () => {
    expectTypeOf(pluralInsteadOfText).not.toExtend<
      ValidateDictionary<typeof pluralInsteadOfText>
    >();
  });

  it('erases the dictionary type in a message reference', () => {
    expectTypeOf(messageRef(messages, 'objects', { count: 1, scene: 'Main' })).toEqualTypeOf(
      messageRef(messages, 'resetLayout'),
    );
  });
});
