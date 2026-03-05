import { create } from "zustand";

interface ActiveProject {
  id: string;
  name: string;
}

interface ProjectStore {
  activeProject: ActiveProject | null;
  setProject: (project: ActiveProject) => void;
  clearProject: () => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  activeProject: null,
  setProject: (project) => set({ activeProject: project }),
  clearProject: () => set({ activeProject: null }),
}));
