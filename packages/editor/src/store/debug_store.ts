import { create } from "zustand";
import type { DebugMessage } from "@proton/engine";
import { Debug, DebugLevel, MessageStyle } from "@proton/engine";
import { defaultEditorConfig } from "../config/editor_config";

export const ALL_LEVELS_MASK =
  (1 << DebugLevel.Verbose) |
  (1 << DebugLevel.Debug) |
  (1 << DebugLevel.Info) |
  (1 << DebugLevel.Warning) |
  (1 << DebugLevel.Error) |
  (1 << DebugLevel.Fatal);

interface DebugStore {
  messages: DebugMessage[];
  filterMask: number;
  maxMessages: number;
  addMessage: (message: DebugMessage) => void;
  clearMessages: () => void;
  setFilterMask: (mask: number) => void;
  setMaxMessages: (max: number) => void;
}

export const useDebugStore = create<DebugStore>((set) => {
  const conf = defaultEditorConfig;

  const store: DebugStore = {
    messages: [],
    filterMask: ALL_LEVELS_MASK,

    maxMessages: conf.console.maxMessages,

    addMessage: (message) =>
      set((state) => {
        const messages = [...state.messages, message];
        if (messages.length > state.maxMessages) {
          messages.splice(0, messages.length - state.maxMessages);
        }
        return { messages };
      }),

    clearMessages: () => set({ messages: [] }),

    setFilterMask: (mask) => set({ filterMask: mask }),

    setMaxMessages: (max) => set({ maxMessages: max }),
  };

  Debug.connect(store.addMessage);

  return store;
});
