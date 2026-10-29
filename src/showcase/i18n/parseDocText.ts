export interface DocTextSegment {
  readonly kind: 'text';
  readonly text: string;
}

export interface DocCodeSegment {
  readonly kind: 'code';
  readonly text: string;
}

export type DocInlineSegment = DocTextSegment | DocCodeSegment;

export interface DocStrongSegment {
  readonly kind: 'strong';
  readonly children: readonly DocInlineSegment[];
}

export interface DocLinkSegment {
  readonly kind: 'link';
  readonly pageId: string;
  readonly children: readonly DocInlineSegment[];
}

export type DocSegment = DocInlineSegment | DocStrongSegment | DocLinkSegment;

const CODE_MARK = '`';
const STRONG_MARK = '**';
const CODE_PATTERN = /`([^`]*)`/g;
const MARKUP_PATTERN = /`([^`]*)`|\*\*(.+?)\*\*|\[([^\]]+)\]\(([^()\s]+)\)/g;

function textSegment(text: string, source: string): DocTextSegment {
  if (text.includes(CODE_MARK) || text.includes(STRONG_MARK)) {
    throw new Error(`Unpaired markup in documentation text "${source}"`);
  }

  return { kind: 'text', text };
}

function splitByPattern<T>(
  text: string,
  pattern: RegExp,
  toText: (text: string) => T,
  toMarkup: (match: RegExpExecArray) => T,
): T[] {
  const segments: T[] = [];
  let position = 0;

  for (const match of text.matchAll(pattern)) {
    if (match.index > position) {
      segments.push(toText(text.slice(position, match.index)));
    }

    segments.push(toMarkup(match));
    position = match.index + match[0].length;
  }

  if (position < text.length) {
    segments.push(toText(text.slice(position)));
  }

  return segments;
}

function parseInline(text: string, source: string): DocInlineSegment[] {
  return splitByPattern<DocInlineSegment>(
    text,
    CODE_PATTERN,
    (plain) => textSegment(plain, source),
    ([, code = '']) => ({ kind: 'code', text: code }),
  );
}

function markupSegment(match: RegExpExecArray, source: string): DocSegment {
  const [, code, strong, linkText, pageId] = match;

  if (code !== undefined) {
    return { kind: 'code', text: code };
  }

  if (strong !== undefined) {
    return { kind: 'strong', children: parseInline(strong, source) };
  }

  if (linkText !== undefined && pageId !== undefined) {
    return { kind: 'link', pageId, children: parseInline(linkText, source) };
  }

  throw new Error(`Unknown markup "${match[0]}" in documentation text "${source}"`);
}

export function parseDocText(text: string): readonly DocSegment[] {
  return splitByPattern<DocSegment>(
    text,
    MARKUP_PATTERN,
    (plain) => textSegment(plain, text),
    (match) => markupSegment(match, text),
  );
}

export function docLinkTargets(segments: readonly DocSegment[]): readonly string[] {
  return segments.flatMap((segment) => (segment.kind === 'link' ? [segment.pageId] : []));
}
