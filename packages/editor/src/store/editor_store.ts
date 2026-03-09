import { create } from "zustand";
import type { DragMeta } from "@proton/ui";

interface EditorState {
  dragMeta: DragMeta | null;
  dragSource: React.RefObject<HTMLElement> | null;
  startDrag: (meta: DragMeta, source: React.RefObject<HTMLElement>) => void;
  endDrag: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  dragMeta: null,
  dragSource: null,
  startDrag: (meta, source) => set({ dragMeta: meta, dragSource: source }),
  endDrag: () => set({ dragMeta: null, dragSource: null }),
}));
