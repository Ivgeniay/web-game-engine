export function classNames(...names: readonly (string | false | undefined)[]): string {
  return names.filter((name) => typeof name === 'string' && name !== '').join(' ');
}
