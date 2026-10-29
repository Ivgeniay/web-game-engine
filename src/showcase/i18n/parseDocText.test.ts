import { describe, expect, it } from 'vitest';
import { docLinkTargets, parseDocText } from './parseDocText';

describe('parseDocText', () => {
  it('keeps a text without markup as one text segment', () => {
    expect(parseDocText('Plain text.')).toEqual([{ kind: 'text', text: 'Plain text.' }]);
  });

  it('returns no segments for an empty text', () => {
    expect(parseDocText('')).toEqual([]);
  });

  it('splits code spans out of the text', () => {
    expect(parseDocText('Use `Icon` or `iconRef`.')).toEqual([
      { kind: 'text', text: 'Use ' },
      { kind: 'code', text: 'Icon' },
      { kind: 'text', text: ' or ' },
      { kind: 'code', text: 'iconRef' },
      { kind: 'text', text: '.' },
    ]);
  });

  it('keeps braces, brackets and stars inside code as code', () => {
    expect(parseDocText('`children({ id })` and `[a](b) ** c`')).toEqual([
      { kind: 'code', text: 'children({ id })' },
      { kind: 'text', text: ' and ' },
      { kind: 'code', text: '[a](b) ** c' },
    ]);
  });

  it('parses strong text with code inside', () => {
    expect(parseDocText('**The `run` handler** runs it')).toEqual([
      {
        kind: 'strong',
        children: [
          { kind: 'text', text: 'The ' },
          { kind: 'code', text: 'run' },
          { kind: 'text', text: ' handler' },
        ],
      },
      { kind: 'text', text: ' runs it' },
    ]);
  });

  it('parses a link to a page with code inside', () => {
    expect(parseDocText('See [`Toolbar`](components/toolbar).')).toEqual([
      { kind: 'text', text: 'See ' },
      {
        kind: 'link',
        pageId: 'components/toolbar',
        children: [{ kind: 'code', text: 'Toolbar' }],
      },
      { kind: 'text', text: '.' },
    ]);
  });

  it('keeps square brackets without a page address as text', () => {
    expect(parseDocText('An array [a, b] (two items)')).toEqual([
      { kind: 'text', text: 'An array [a, b] (two items)' },
    ]);
  });

  it.each(['Use `Icon.', 'A **strong text', 'Code `a` and `b'])(
    'rejects unpaired markup in %j',
    (text) => {
      expect(() => parseDocText(text)).toThrow(/Unpaired markup/);
    },
  );
});

describe('docLinkTargets', () => {
  it('lists the page addresses of all links', () => {
    expect(docLinkTargets(parseDocText('[A](overview), `[b](c)` and [D](shell/undo)'))).toEqual([
      'overview',
      'shell/undo',
    ]);
  });
});
