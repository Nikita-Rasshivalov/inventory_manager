import { create } from "zustand";
import { User } from "../models/models";
import { UserService } from "../services/userService";

interface UserStore {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  search: string;

  getAll: (search?: string) => Promise<User[]>;
  setSearch: (search: string) => void;
  uploadProfilePhoto: (file: File) => Promise<User | null>;
  getById: (userId: number) => Promise<User | null>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  currentUser: null,
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

  uploadProfilePhoto: async (file: File) => {
    set({ loading: true, error: null });
    try {
      const updatedUser = await UserService.uploadProfilePhoto(file);
      set({ currentUser: updatedUser });
      return updatedUser;
    } catch (err: any) {
      set({ error: err.message || "Failed to upload profile photo" });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  getById: async (userId: number) => {
    set({ loading: true, error: null });
    try {
      const user = await UserService.getById(userId);
      return user;
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch user" });
      return null;
    } finally {
      set({ loading: false });
    }
  },
}));
