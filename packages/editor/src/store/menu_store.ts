import type { MenuBarItem, MenuBarRegistry } from "@proton/ui";
import { create } from "zustand";

interface MenuStore {
  registries: Record<string, MenuBarRegistry>;
  registerBar: (registry: MenuBarRegistry) => void;
  unregisterBar: (id: string) => void;
  registerItem: (barId: string, item: MenuBarItem) => void;
  unregisterItem: (barId: string, itemId: string) => void;
}

export const useMenuStore = create<MenuStore>((set) => ({
  registries: {},
  registerBar: (registry) =>
    set((state) => ({
      registries: {
        ...state.registries,
        [registry.id]: registry,
      },
    })),
  unregisterBar: (id) =>
    set((state) => {
      const registries = { ...state.registries };
      delete registries[id];
      return { registries };
    }),
  registerItem: (barId, item) =>
    set((state) => {
      const bar = state.registries[barId];
      if (!bar) return state;
      return {
        registries: {
          ...state.registries,
          [barId]: {
            ...bar,
            items: [...bar.items, item],
          },
        },
      };
    }),
  unregisterItem: (barId, itemId) =>
    set((state) => {
      const bar = state.registries[barId];
      if (!bar) return state;
      return {
        registries: {
          ...state.registries,
          [barId]: {
            ...bar,
            items: bar.items.filter((item) => item.id !== itemId),
          },
        },
      };
    }),
}));
