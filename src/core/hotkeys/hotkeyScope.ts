export const HOTKEY_SCOPE_ATTRIBUTE = 'data-hotkey-scope';

export interface HotkeyScopeProps {
  readonly [HOTKEY_SCOPE_ATTRIBUTE]: string;
}

export function hotkeyScopeProps(scope: string): HotkeyScopeProps {
  return { [HOTKEY_SCOPE_ATTRIBUTE]: scope };
}

export function hotkeyScopesOf(target: Element): string[] {
  const scopes: string[] = [];
  let element = target.closest(`[${HOTKEY_SCOPE_ATTRIBUTE}]`);

  while (element !== null) {
    const scope = element.getAttribute(HOTKEY_SCOPE_ATTRIBUTE);

    if (scope !== null) {
      scopes.push(scope);
    }

    element = element.parentElement?.closest(`[${HOTKEY_SCOPE_ATTRIBUTE}]`) ?? null;
  }

  return scopes;
}
