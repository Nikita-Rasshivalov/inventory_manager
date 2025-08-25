import { create } from "zustand";
import { Item, ItemPayload } from "../models/models";
import { ItemService } from "../services/ItemService";

interface ItemStore {
  items: Item[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  loading: boolean;
  error: string | null;

  getAll: (inventoryId: number, page?: number) => Promise<void>;
  create: (inventoryId: number, data: ItemPayload) => Promise<void>;
  update: (
    inventoryId: number,
    itemId: number,
    data: Partial<ItemPayload>
  ) => Promise<void>;
  delete: (inventoryId: number, itemId: number) => Promise<string>;
  setPage: (page: number) => void;
}

export const useItemStore = create<ItemStore>((set, get) => ({
  items: [],
  total: 0,
  page: 1,
  totalPages: 1,
  limit: 12,
  loading: false,
  error: null,

  getAll: async (inventoryId, page = get().page) => {
    const { limit } = get();
    set({ loading: true, error: null });
    try {
      const data = await ItemService.getAll(inventoryId, page, limit);
      set({
        items: data.items,
        total: data.total,
        page: data.page,
        totalPages: data.totalPages,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch items";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  create: async (inventoryId, data) => {
    set({ loading: true, error: null });
    try {
      await ItemService.create(inventoryId, data);
      await get().getAll(inventoryId);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create item";
      set({ error: message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  update: async (inventoryId, itemId, data) => {
    set({ loading: true, error: null });
    try {
      await ItemService.update(inventoryId, itemId, data);
      await get().getAll(inventoryId);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update item";
      set({ error: message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  delete: async (inventoryId, itemId) => {
    set({ loading: true, error: null });
    try {
      const res = await ItemService.delete(inventoryId, itemId);
      await get().getAll(inventoryId);
      return res.message;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete item";
      set({ error: message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  setPage: (page) => set({ page }),
}));
