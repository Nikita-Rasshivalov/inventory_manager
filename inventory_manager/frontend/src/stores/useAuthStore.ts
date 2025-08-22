import { create } from "zustand";
import { User } from "../models/models";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  initialized: boolean;
  setInitialized: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  initialized: false,
  setInitialized: (value) => set({ initialized: value }),
}));
