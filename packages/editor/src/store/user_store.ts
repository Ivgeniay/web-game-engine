import { create } from "zustand";

interface User {
  id: number;
  username: string;
  email: string | null;
}

interface UserStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User, token: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setUser: (user, token) => set({ user, token, isAuthenticated: true }),

  clearUser: () => set({ user: null, token: null, isAuthenticated: false }),
}));
