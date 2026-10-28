const KEY_ACTIVATED_INPUT_TYPES: ReadonlySet<string> = new Set([
  'checkbox',
  'radio',
  'button',
  'submit',
  'reset',
]);

const KEY_ACTIVATED_ROLES: ReadonlySet<string> = new Set([
  'button',
  'checkbox',
  'radio',
  'link',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
]);

const ROLE_ATTRIBUTE = 'role';

export function isKeyActivatedElement(element: Element): boolean {
  if (element instanceof HTMLButtonElement) {
    return true;
  }

  if (element instanceof HTMLInputElement) {
    return KEY_ACTIVATED_INPUT_TYPES.has(element.type);
  }

  if (element instanceof HTMLAnchorElement && element.hasAttribute('href')) {
    return true;
  }

  const role = element.getAttribute(ROLE_ATTRIBUTE);

  return role !== null && KEY_ACTIVATED_ROLES.has(role);
}
