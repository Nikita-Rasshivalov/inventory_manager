import { create } from "zustand";
import { Inventory, InventoryPayload } from "../models/models";
import { InventoryService } from "../services/inventoryService";

interface InventoryStore {
  inventories: Inventory[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  search: string;
  loading: boolean;
  error: string | null;

  getAll: (
    page?: number,
    sortBy?: string,
    sortOrder?: "asc" | "desc"
  ) => Promise<void>;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;

  create: (data: InventoryPayload) => Promise<void>;
  update: (id: number, data: Partial<InventoryPayload>) => Promise<void>;
  delete: (ids: number[]) => Promise<string>;
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  inventories: [],
  total: 0,
  page: 1,
  totalPages: 1,
  limit: 12,
  search: "",
  loading: false,
  error: null,

  getAll: async (
    page = get().page,
    sortBy?: string,
    sortOrder?: "asc" | "desc"
  ) => {
    const { limit, search } = get();
    set({ loading: true, error: null });
    try {
      const data = await InventoryService.getAll(
        page,
        limit,
        search,
        sortBy,
        sortOrder
      );
      set({
        inventories: data.items,
        total: data.total,
        page: data.page,
        totalPages: data.totalPages,
      });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch inventories" });
    } finally {
      set({ loading: false });
    }
  },

  setPage: (page: number) => {
    set({ page });
  },

  setSearch: (search: string) => {
    set({ search, page: 1 });
  },

  create: async (data: InventoryPayload) => {
    set({ loading: true, error: null });
    try {
      const newInventory = await InventoryService.create(data);
      set({ inventories: [...get().inventories, newInventory] });
    } catch (err: any) {
      set({ error: err.message || "Failed to create inventory" });
    } finally {
      set({ loading: false });
    }
  },

  update: async (id: number, data: Partial<InventoryPayload>) => {
    set({ loading: true, error: null });
    try {
      const updated = await InventoryService.update(id, data);
      set({
        inventories: get().inventories.map((inv) =>
          inv.id === id ? updated : inv
        ),
      });
    } catch (err: any) {
      set({ error: err.message || "Failed to update inventory" });
    } finally {
      set({ loading: false });
    }
  },

  delete: async (ids: number[]) => {
    set({ loading: true, error: null });
    try {
      const res = await InventoryService.delete(ids);
      set({
        inventories: get().inventories.filter((inv) => !ids.includes(inv.id)),
      });
      return res.message;
    } catch (err: any) {
      set({ error: err.message || "Failed to delete inventories" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
