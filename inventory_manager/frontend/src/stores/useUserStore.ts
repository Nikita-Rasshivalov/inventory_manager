import { create } from "zustand";
import { User } from "../models/models";
import { UserService } from "../services/userService";

interface UserStore {
  users: User[];
  loading: boolean;
  error: string | null;
  search: string;

  getAll: (search?: string) => Promise<User[]>;
  setSearch: (search: string) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  loading: false,
  error: null,
  search: "",

  getAll: async (search?: string) => {
    set({ loading: true, error: null });
    try {
      const data = await UserService.getAll(search);
      set({ users: data });
      return data;
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch users" });
      return [];
    } finally {
      set({ loading: false });
    }
  },

  setSearch: (search: string) => {
    set({ search });
    get().getAll(search);
  },
}));
