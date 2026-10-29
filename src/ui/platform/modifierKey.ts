export interface ModifierKeys {
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
}

export function isModPressed({ ctrlKey, metaKey }: ModifierKeys, isMac: boolean): boolean {
  return isMac ? metaKey : ctrlKey;
}
