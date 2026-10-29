import type { TextRange } from '@/ui/listView/ListRowContent';
import type { TreeModel, TreeVisibility } from './treeModel';

export interface TreeFilter extends TreeVisibility {
  readonly matchIds: ReadonlySet<string>;
}

const NOT_FOUND = -1;
const NO_HIGHLIGHT: TextRange = { start: 0, length: 0 };

export function normalizeFilter(filter: string): string {
  return filter.trim();
}

export function findMatch(label: string, query: string, locale: string): TextRange | null {
  const lowerLabel = label.toLocaleLowerCase(locale);
  const lowerQuery = query.toLocaleLowerCase(locale);
  const start = lowerLabel.indexOf(lowerQuery);

  if (start === NOT_FOUND) {
    return null;
  }

  const sameLength = lowerLabel.length === label.length && lowerQuery.length === query.length;

  return sameLength ? { start, length: query.length } : NO_HIGHLIGHT;
}

export function filterTree(model: TreeModel, query: string, locale: string): TreeFilter {
  const matchIds = new Set<string>();
  const visibleIds = new Set<string>();
  const parentIds = new Set<string>();

  function visit(id: string): boolean {
    let hasVisibleChild = false;

    if (model.hasChildren(id)) {
      for (const childId of model.getChildren(id)) {
        hasVisibleChild = visit(childId) || hasVisibleChild;
      }
    }

    const matches = findMatch(model.getLabel(id), query, locale) !== null;

    if (matches) {
      matchIds.add(id);
    }
    if (hasVisibleChild) {
      parentIds.add(id);
    }
    if (matches || hasVisibleChild) {
      visibleIds.add(id);
    }

    return matches || hasVisibleChild;
  }

  for (const rootId of model.rootIds) {
    visit(rootId);
  }

  return { matchIds, visibleIds, parentIds };
}

export function findAncestors(model: TreeModel, targetId: string): readonly string[] | null {
  const path: string[] = [];

  function visit(ids: readonly string[]): boolean {
    for (const id of ids) {
      if (id === targetId) {
        return true;
      }
      if (model.hasChildren(id)) {
        path.push(id);

        if (visit(model.getChildren(id))) {
          return true;
        }

        path.pop();
      }
    }

    return false;
  }

  return visit(model.rootIds) ? path : null;
}
