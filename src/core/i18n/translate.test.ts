import { describe, expect, it } from 'vitest';
import { defineMessages } from './messages';
import { messageRef, translate, translateRef } from './translate';

const messages = defineMessages({
  en: {
    resetLayout: 'Reset layout',
    selected: 'Selected: {count}',
    greeting: 'Hello, {name}! You have {count} tabs',
    objects: { one: '{count} object', other: '{count} objects' },
    objectsInScene: { one: '{count} object in {scene}', other: '{count} objects in {scene}' },
  },
  ru: {
    resetLayout: 'Сбросить раскладку',
    selected: 'Выбрано: {count}',
    greeting: 'Привет, {name}! Открыто вкладок: {count}',
    objects: {
      one: '{count} объект',
      few: '{count} объекта',
      many: '{count} объектов',
      other: '{count} объекта',
    },
    objectsInScene: {
      one: '{count} объект в {scene}',
      few: '{count} объекта в {scene}',
      many: '{count} объектов в {scene}',
      other: '{count} объекта в {scene}',
    },
  },
});

const RUSSIAN_PLURALS = [
  { count: 0, expected: '0 объектов' },
  { count: 1, expected: '1 объект' },
  { count: 2, expected: '2 объекта' },
  { count: 5, expected: '5 объектов' },
  { count: 11, expected: '11 объектов' },
  { count: 12, expected: '12 объектов' },
  { count: 21, expected: '21 объект' },
  { count: 22, expected: '22 объекта' },
  { count: 25, expected: '25 объектов' },
  { count: 101, expected: '101 объект' },
  { count: 111, expected: '111 объектов' },
  { count: 1.5, expected: '1,5 объекта' },
];

const ENGLISH_PLURALS = [
  { count: 0, expected: '0 objects' },
  { count: 1, expected: '1 object' },
  { count: 2, expected: '2 objects' },
];

describe('translate', () => {
  it('returns the text of a plain message in each language', () => {
    expect(translate(messages, 'en', 'resetLayout')).toBe('Reset layout');
    expect(translate(messages, 'ru', 'resetLayout')).toBe('Сбросить раскладку');
  });

  it('substitutes parameters into the text', () => {
    expect(translate(messages, 'en', 'greeting', { name: 'Ada', count: 3 })).toBe(
      'Hello, Ada! You have 3 tabs',
    );
    expect(translate(messages, 'ru', 'greeting', { name: 'Ада', count: 3 })).toBe(
      'Привет, Ада! Открыто вкладок: 3',
    );
  });

  it('formats numeric parameters by the rules of the language', () => {
    expect(translate(messages, 'en', 'selected', { count: 1.5 })).toBe('Selected: 1.5');
    expect(translate(messages, 'ru', 'selected', { count: 1.5 })).toBe('Выбрано: 1,5');
  });

  it.each(RUSSIAN_PLURALS)('selects the Russian plural form for $count', ({ count, expected }) => {
    expect(translate(messages, 'ru', 'objects', { count })).toBe(expected);
  });

  it.each(ENGLISH_PLURALS)('selects the English plural form for $count', ({ count, expected }) => {
    expect(translate(messages, 'en', 'objects', { count })).toBe(expected);
  });

  it('substitutes other parameters into the selected plural form', () => {
    expect(translate(messages, 'en', 'objectsInScene', { count: 1, scene: 'Main' })).toBe(
      '1 object in Main',
    );
    expect(translate(messages, 'ru', 'objectsInScene', { count: 22, scene: 'Main' })).toBe(
      '22 объекта в Main',
    );
  });
});

describe('messageRef', () => {
  it('resolves to the text in the language given at resolution time', () => {
    const ref = messageRef(messages, 'resetLayout');

    expect(translateRef(ref, 'en')).toBe('Reset layout');
    expect(translateRef(ref, 'ru')).toBe('Сбросить раскладку');
  });

  it('keeps its parameters for every resolution', () => {
    const ref = messageRef(messages, 'objects', { count: 5 });

    expect(translateRef(ref, 'en')).toBe('5 objects');
    expect(translateRef(ref, 'ru')).toBe('5 объектов');
  });
});
