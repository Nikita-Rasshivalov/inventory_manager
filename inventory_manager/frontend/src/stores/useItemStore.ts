import { create } from "zustand";
import { Item, ItemPayload } from "../models/models";
import { ItemService } from "../services/ItemService";

interface ItemStore {
  items: Item[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  search: string;
  loading: boolean;
  error: string | null;
  sortBy?: string;
  sortOrder?: "asc" | "desc";

  getAll: (
    inventoryId: number,
    page?: number,
    sortBy?: string,
    sortOrder?: "asc" | "desc",
    search?: string
  ) => Promise<void>;
  setPage: (page: number) => void;
  setSorting: (sortBy?: string, sortOrder?: "asc" | "desc") => void;
  setSearch: (search: string) => void;

  create: (inventoryId: number) => Promise<void>;
  update: (
    inventoryId: number,
    itemId: number,
    data: ItemPayload
  ) => Promise<Item>;
  delete: (inventoryId: number, itemId: number) => Promise<string>;
  getById: (inventoryId: number, itemId: number) => Promise<Item>;

  currentItem: Item | null;
  setCurrentItem: (item: Item | null) => void;
  fetchItemById: (inventoryId: number, itemId: number) => Promise<Item>;
}

export const useItemStore = create<ItemStore>((set, get) => ({
  items: [],
  total: 0,
  page: 1,
  totalPages: 1,
  limit: 8,
  search: "",
  loading: false,
  error: null,
  sortBy: undefined,
  sortOrder: undefined,

  getAll: async (
    inventoryId,
    page = get().page,
    sortBy = get().sortBy,
    sortOrder = get().sortOrder
  ) => {
    const { limit } = get();
    set({ loading: true, error: null });
    try {
      const data = await ItemService.getAll(
        inventoryId,
        page,
        limit,
        sortBy,
        sortOrder
      );
      set({
        items: data.items,
        total: data.total,
        page: data.page,
        totalPages: data.totalPages,
      });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch items" });
    } finally {
      set({ loading: false });
    }
  },

  setPage: (page: number) => set({ page }),
  setSorting: (sortBy?: string, sortOrder?: "asc" | "desc") =>
    set({ sortBy, sortOrder, page: 1 }),
  setSearch: (search: string) => set({ search, page: 1 }),

  create: async (inventoryId) => {
    set({ loading: true, error: null });
    try {
      await ItemService.create(inventoryId);
      await get().getAll(inventoryId);
    } catch (err: any) {
      set({ error: err.message || "Failed to create item" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  update: async (inventoryId, itemId, data) => {
    try {
      const currentItem = await ItemService.getById(inventoryId, itemId);
      let updatedItem: Item;

      if (data.version !== currentItem.version) {
        updatedItem = currentItem;
      } else {
        updatedItem = await ItemService.update(inventoryId, itemId, data);
      }

      set({ currentItem: updatedItem });
      return updatedItem;
    } catch (err: any) {
      set({ error: err.message || "Failed to update item" });
      throw err;
    }
  },

  delete: async (inventoryId, itemId) => {
    set({ loading: true, error: null });
    try {
      const res = await ItemService.delete(inventoryId, itemId);
      await get().getAll(inventoryId);
      return res.message;
    } catch (err: any) {
      set({ error: err.message || "Failed to delete item" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  getById: async (inventoryId, itemId) => {
    set({ loading: true, error: null });
    try {
      const item = await ItemService.getById(inventoryId, itemId);
      return item;
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch item" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
  currentItem: null,
  setCurrentItem: (item) => set({ currentItem: item }),
  fetchItemById: async (inventoryId, itemId) => {
    set({ loading: true, error: null });
    try {
      const item = await ItemService.getById(inventoryId, itemId);
      set({ currentItem: item });
      return item;
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch item" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
