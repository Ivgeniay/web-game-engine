import { useContext, useEffect, useEffectEvent, useId, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { createFoldoutBroadcast } from './foldoutBroadcast';
import type { FoldoutBroadcast } from './foldoutBroadcast';
import { FoldoutContext } from './foldoutContext';

export interface FoldoutOptions {
  readonly expanded: boolean;
  readonly onExpandedChange: (expanded: boolean) => void;
}

export interface FoldoutToggleEvent {
  readonly altKey: boolean;
}

export interface Foldout {
  readonly contentId: string;
  readonly broadcast: FoldoutBroadcast;
  readonly toggle: (event: FoldoutToggleEvent) => void;
  readonly handleKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

export function useFoldout({ expanded, onExpandedChange }: FoldoutOptions): Foldout {
  const contentId = useId();
  const parent = useContext(FoldoutContext);
  const [broadcast] = useState(createFoldoutBroadcast);

  const followParent = useEffectEvent((next: boolean) => {
    if (next !== expanded) {
      onExpandedChange(next);
    }

    broadcast.emit(next);
  });

  useEffect(() => parent?.subscribe(followParent), [parent]);

  function setExpanded(next: boolean, nested: boolean): void {
    if (next !== expanded) {
      onExpandedChange(next);
    }
    if (nested) {
      broadcast.emit(next);
    }
  }

  return {
    contentId,
    broadcast,
    toggle: ({ altKey }) => {
      setExpanded(!expanded, altKey);
    },
    handleKeyDown: (event) => {
      if (event.key === 'ArrowRight' && !expanded) {
        event.preventDefault();
        setExpanded(true, event.altKey);
      } else if (event.key === 'ArrowLeft' && expanded) {
        event.preventDefault();
        setExpanded(false, event.altKey);
      }
    },
  };
}
