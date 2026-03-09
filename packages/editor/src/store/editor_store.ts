import { create } from "zustand";
import type { DragMeta } from "@proton/ui";

interface EditorState {
  dragMeta: DragMeta | null;
  dragSource: React.RefObject<HTMLElement> | null;
  editingId: string | null;
  startDrag: (meta: DragMeta, source: React.RefObject<HTMLElement>) => void;
  endDrag: () => void;
  setEditingId: (id: string | null) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  dragMeta: null,
  dragSource: null,
  editingId: null,
  startDrag: (meta, source) => set({ dragMeta: meta, dragSource: source }),
  endDrag: () => set({ dragMeta: null, dragSource: null }),
  setEditingId: (id) => set({ editingId: id }),
}));
