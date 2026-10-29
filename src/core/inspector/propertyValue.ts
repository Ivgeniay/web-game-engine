function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sameArrays(first: readonly unknown[], second: readonly unknown[]): boolean {
  return (
    first.length === second.length &&
    first.every((item, index) => samePropertyValue(item, second[index]))
  );
}

function sameRecords(
  first: Readonly<Record<string, unknown>>,
  second: Readonly<Record<string, unknown>>,
): boolean {
  const keys = Object.keys(first);

  return (
    keys.length === Object.keys(second).length &&
    keys.every((key) => Object.hasOwn(second, key) && samePropertyValue(first[key], second[key]))
  );
}

export function samePropertyValue(first: unknown, second: unknown): boolean {
  if (Object.is(first, second)) {
    return true;
  }

  if (Array.isArray(first) && Array.isArray(second)) {
    return sameArrays(first, second);
  }

  return isRecord(first) && isRecord(second) && sameRecords(first, second);
}
