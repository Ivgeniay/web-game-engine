import { KIND_VALUES, EXTRA_DRAG_TYPES } from "./types";
import type { DragMeta, DropAccepts, DragType } from "./types";

const [EXT, EXT_EXC, KIND_EXC] = EXTRA_DRAG_TYPES;

function matchValue(
  metaValue: string,
  acceptValue: string | string[],
): boolean {
  const values = Array.isArray(acceptValue) ? acceptValue : [acceptValue];
  return values.some((v) =>
    new RegExp(`^${v.replace("*", ".*")}$`).test(metaValue),
  );
}

function getKindFromMeta(meta: DragMeta): string | undefined {
  const kindKey = KIND_VALUES.find((k) => meta[k] !== undefined);
  return kindKey ? meta[kindKey] : undefined;
}

export function checkDrop(
  meta: DragMeta | null,
  accepts: DropAccepts,
): boolean {
  if (!meta) return false;

  for (const key in accepts) {
    const dragType = key as DragType;
    const acceptValue = accepts[dragType];
    if (acceptValue === undefined) continue;

    if (dragType === EXT_EXC) {
      const metaExt = meta[EXT];
      if (metaExt && matchValue(metaExt, acceptValue)) return false;
      continue;
    }

    if (dragType === KIND_EXC) {
      const metaKind = getKindFromMeta(meta);
      if (metaKind && matchValue(metaKind, acceptValue)) return false;
      continue;
    }

    const metaValue = meta[dragType];
    if (!metaValue) return false;
    if (!matchValue(metaValue, acceptValue)) return false;
  }

  return true;
}
