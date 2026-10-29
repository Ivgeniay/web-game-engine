import { VALUE_EDIT_ATTRIBUTE } from '@/contracts/valueChange';
import type { ValueEditState } from '@/contracts/valueChange';

const COMMITTED_VALUE_EDIT: ValueEditState = 'committed';

const TEXT_INPUT_TYPES: ReadonlySet<string> = new Set([
  'text',
  'search',
  'email',
  'url',
  'tel',
  'password',
  'number',
]);

export function isTextInput(element: Element): boolean {
  if (element instanceof HTMLInputElement) {
    return TEXT_INPUT_TYPES.has(element.type);
  }

  return (
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement ||
    (element instanceof HTMLElement && element.isContentEditable)
  );
}

export function isCommittedValueField(element: Element): boolean {
  return element.getAttribute(VALUE_EDIT_ATTRIBUTE) === COMMITTED_VALUE_EDIT;
}
