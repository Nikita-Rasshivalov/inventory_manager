import { create } from "zustand";
import {
  Inventory,
  InventoryPayload,
  InventoryMember,
  InventoryRole,
  MemberAction,
  CustomIdPart,
} from "../models/models";
import { InventoryService } from "../services/inventoryService";

interface InventoryStore {
  inventories: Inventory[];
  inventoryMembers: InventoryMember[];
  customIdTemplate: CustomIdPart[];
  currentInventory: Inventory | null;
  version: number;
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  search: string;
  activeTab: InventoryRole;
  loading: boolean;
  error: string | null;

  editingRoleUserId: number | null;
  editingRoleValue: InventoryRole | null;
  startEditRole: (userId: number, currentRole: InventoryRole) => void;
  setEditingRoleValue: (role: InventoryRole) => void;
  saveEditRole: (inventoryId: number) => Promise<void>;
  cancelEditRole: () => void;

  getAll: (
    page?: number,
    sortBy?: string,
    sortOrder?: "asc" | "desc",
    tab?: InventoryRole,
    search?: string
  ) => Promise<void>;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setActiveTab: (tab: InventoryRole) => void;
  create: (data: InventoryPayload) => Promise<void>;
  update: (id: number, data: Partial<InventoryPayload>) => Promise<void>;
  delete: (ids: number[]) => Promise<string>;
  getById: (id: number) => Promise<Inventory>;
  updateMembers: (
    inventoryId: number,
    updates: {
      userId: number;
      role?: InventoryRole;
      action: MemberAction;
    }[]
  ) => Promise<void>;

  loadCustomIdTemplate: (inventoryId: number) => Promise<void>;
  saveCustomIdTemplate: (
    inventoryId: number,
    template: CustomIdPart[]
  ) => Promise<void>;
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  inventories: [],
  inventoryMembers: [],
  customIdTemplate: [],
  currentInventory: null,
  version: 0,
  total: 0,
  page: 1,
  totalPages: 1,
  limit: 12,
  search: "",
  activeTab: InventoryRole.OWNER,
  loading: false,
  error: null,

  editingRoleUserId: null,
  editingRoleValue: null,

  startEditRole: (userId, currentRole) =>
    set({ editingRoleUserId: userId, editingRoleValue: currentRole }),
  setEditingRoleValue: (role) => set({ editingRoleValue: role }),
  saveEditRole: async (inventoryId) => {
    const { editingRoleUserId, editingRoleValue } = get();
    if (!editingRoleUserId || !editingRoleValue) return;
    try {
      await get().updateMembers(inventoryId, [
        {
          userId: editingRoleUserId,
          role: editingRoleValue,
          action: MemberAction.Update,
        },
      ]);
    } finally {
      set({ editingRoleUserId: null, editingRoleValue: null });
    }
  },
  cancelEditRole: () =>
    set({ editingRoleUserId: null, editingRoleValue: null }),

  getAll: async (
    page = get().page,
    sortBy,
    sortOrder,
    tab = get().activeTab,
    search = get().search
  ) => {
    const { limit } = get();
    set({ loading: true, error: null });
    try {
      const data = await InventoryService.getAll(
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        tab
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

  setPage: (page: number) => set({ page }),
  setSearch: (search: string) => set({ search, page: 1 }),
  setActiveTab: (tab: InventoryRole) => set({ activeTab: tab, page: 1 }),

  create: async (data: InventoryPayload) => {
    set({ loading: true, error: null });
    try {
      await InventoryService.create(data);
      await get().getAll();
    } catch (err: any) {
      set({ error: err.message || "Failed to create inventory" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  update: async (id: number, data: Partial<InventoryPayload>) => {
    set({ loading: true, error: null });
    try {
      const inventory = await get().getById(id);
      const payload: any = { ...data, version: inventory.version };

      if (data.customIdFormat) {
        payload.customIdFormat = data.customIdFormat;
      }

      await InventoryService.update(id, payload);
      if (data.customIdFormat) set({ customIdTemplate: data.customIdFormat });

      await get().getAll();
    } catch (err: any) {
      if (err.message?.includes("version mismatch")) {
        const fresh = await get().getById(id);
        set({ version: fresh.version });
        try {
          const retryPayload: any = { ...data, version: fresh.version };
          await InventoryService.update(id, retryPayload);
          await get().getAll();
        } catch (retryErr: any) {
          set({ error: retryErr.message || "Failed to update after retry" });
          throw retryErr;
        }
      } else {
        set({ error: err.message || "Failed to update inventory" });
        throw err;
      }
    } finally {
      set({ loading: false });
    }
  },

  delete: async (ids: number[]) => {
    set({ loading: true, error: null });
    try {
      const res = await InventoryService.delete(ids);
      await get().getAll();
      return res.message;
    } catch (err: any) {
      set({ error: err.message || "Failed to delete inventories" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  getById: async (id: number) => {
    set({ loading: true, error: null, inventoryMembers: [] });
    try {
      const inventory = await InventoryService.getById(id);
      const template: CustomIdPart[] = inventory.customIdFormat
        ? JSON.parse(inventory.customIdFormat)
        : [];
      set({
        inventoryMembers: inventory.members,
        customIdTemplate: template,
        currentInventory: inventory,
        version: inventory.version,
      });
      return inventory;
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch inventory" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateMembers: async (inventoryId, updates) => {
    set({ loading: true, error: null });
    try {
      await InventoryService.updateMembers(inventoryId, updates);
      const inventory = await get().getById(inventoryId);
      set({ inventoryMembers: inventory.members });
    } catch (err: any) {
      set({ error: err.message || "Failed to update members" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  loadCustomIdTemplate: async (inventoryId) => {
    set({ loading: true, error: null });
    try {
      const inventory = await InventoryService.getById(inventoryId);
      const template: CustomIdPart[] = inventory.customIdFormat
        ? JSON.parse(inventory.customIdFormat)
        : [];
      set({ customIdTemplate: template, version: inventory.version });
    } catch (err: any) {
      set({ error: err.message || "Failed to load template" });
    } finally {
      set({ loading: false });
    }
  },

  saveCustomIdTemplate: async (inventoryId, template) => {
    set({ loading: true, error: null });
    try {
      await get().update(inventoryId, { customIdFormat: template });
      set({ customIdTemplate: template });
    } catch (err: any) {
      set({ error: err.message || "Failed to save template" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
