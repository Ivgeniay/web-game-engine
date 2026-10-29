import { createElement, useEffect, useReducer, useState, useSyncExternalStore } from 'react';
import type { InspectorSection, InspectorSource } from '@/contracts/inspector';
import { useEditorRegistries } from '@/state/registries/registriesContext';
import { InspectorItems } from './InspectorItems';
import { InspectorSectionFrame } from './InspectorSectionFrame';
import styles from './Inspector.module.css';

interface InspectorProps {
  readonly source: InspectorSource;
  readonly targetIds: readonly string[];
}

function countChange(count: number): number {
  return count + 1;
}

export function Inspector({ source, targetIds }: InspectorProps) {
  const { inspectorSections } = useEditorRegistries();
  const [, refresh] = useReducer(countChange, 0);
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(new Set());

  useSyncExternalStore(inspectorSections.subscribe, inspectorSections.getSnapshot);
  useEffect(() => source.subscribe(refresh), [source]);

  if (targetIds.length === 0) {
    return null;
  }

  function sectionProps(section: InspectorSection) {
    return {
      section,
      targetIds,
      expanded: !collapsed.has(section.id),
      onExpandedChange: (expanded: boolean) => {
        setCollapsed((current) => {
          const next = new Set(current);

          if (expanded) {
            next.delete(section.id);
          } else {
            next.add(section.id);
          }

          return next;
        });
      },
    };
  }

  return (
    <div className={styles.root}>
      {source.getSections(targetIds).map((section) => {
        const renderer = inspectorSections.get(section.type);

        return renderer === undefined ? (
          <InspectorSectionFrame key={section.id} {...sectionProps(section)}>
            <InspectorItems items={section.items} targetIds={targetIds} />
          </InspectorSectionFrame>
        ) : (
          createElement(renderer.component, { key: section.id, ...sectionProps(section) })
        );
      })}
    </div>
  );
}
