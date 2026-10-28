const KEEPS_ENTER_ROLES: ReadonlySet<string> = new Set([
  'button',
  'combobox',
  'option',
  'menuitem',
]);

export function keepsEnterForItself(target: EventTarget): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const role = target.getAttribute('role');

  return (
    target instanceof HTMLButtonElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target instanceof HTMLAnchorElement ||
    target.isContentEditable ||
    (role !== null && KEEPS_ENTER_ROLES.has(role))
  );
}
