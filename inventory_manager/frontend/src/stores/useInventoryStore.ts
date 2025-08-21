import { create } from "zustand";
import { Inventory, InventoryPayload } from "../models/models";
import { InventoryService } from "../services/inventoryService";

interface InventoryStore {
  inventories: Inventory[];
  loading: boolean;
  error: string | null;
  getAll: () => Promise<void>;
  create: (data: InventoryPayload) => Promise<void>;
  update: (id: number, data: Partial<InventoryPayload>) => Promise<void>;
  delete: (ids: number[]) => Promise<string>;
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  inventories: [],
  loading: false,
  error: null,

  getAll: async () => {
    set({ loading: true, error: null });
    try {
      const data = await InventoryService.getAll();
      set({ inventories: data });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch inventories" });
    } finally {
      set({ loading: false });
    }
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
