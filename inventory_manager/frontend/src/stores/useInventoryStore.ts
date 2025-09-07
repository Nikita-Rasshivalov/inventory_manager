import { create } from "zustand";
import {
  Inventory,
  InventoryPayload,
  InventoryMember,
  InventoryRole,
  MemberAction,
  CustomIdPart,
  InventoryTabId,
  User,
  InventoryFilter,
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
  activeTab: InventoryTabId;
  loading: boolean;
  error: string | null;
  editingRoleUserId: number | null;
  editingRoleValue: InventoryRole | null;
  startEditRole: (userId: number, currentRole: InventoryRole) => void;
  setEditingRoleValue: (role: InventoryRole) => void;
  saveEditRole: (inventoryId: number) => Promise<void>;
  cancelEditRole: () => void;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setActiveTab: (tab: InventoryTabId) => void;
  create: (data: InventoryPayload) => Promise<void>;
  update: (id: number, data: Partial<InventoryPayload>) => Promise<void>;
  delete: (ids: number[]) => Promise<string>;
  getById: (id: number) => Promise<Inventory>;
  loadCustomIdTemplate: (inventoryId: number) => Promise<void>;
  getAll: () => Promise<void>;
  sorting: { sortBy?: string; sortOrder?: "asc" | "desc" };
  setSorting: (sorting: {
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => void;
  updateMembers: (
    inventoryId: number,
    updates: { userId: number; role?: InventoryRole; action: MemberAction }[]
  ) => Promise<void>;
  saveCustomIdTemplate: (
    inventoryId: number,
    template: CustomIdPart[]
  ) => Promise<void>;
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  fetchAll: () => Promise<void>;
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  inventories: [],
  inventoryMembers: [],
  customIdTemplate: [],
  currentInventory: null,
  currentUser: null,
  version: 0,
  total: 0,
  page: 1,
  totalPages: 1,
  limit: 10,
  search: "",
  activeTab: InventoryTabId.Own,
  loading: false,
  error: null,

  editingRoleUserId: null,
  editingRoleValue: null,

  sorting: { sortBy: "created", sortOrder: "desc" },
  setSorting: (sorting) => set({ sorting }),

  setCurrentUser: (user: User) => set({ currentUser: user }),
  setPage: (page: number) => set({ page }),
  setSearch: (search: string) => set({ search, page: 1 }),
  setActiveTab: (tab: InventoryTabId) => set({ activeTab: tab, page: 1 }),
  setEditingRoleValue: (role) => set({ editingRoleValue: role }),

  startEditRole: (userId, currentRole) =>
    set({ editingRoleUserId: userId, editingRoleValue: currentRole }),
  cancelEditRole: () =>
    set({ editingRoleUserId: null, editingRoleValue: null }),

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

  create: async (data: InventoryPayload) => {
    set({ loading: true, error: null });
    try {
      await InventoryService.create({
        ...data,
        isPublic: data.isPublic ?? false,
      });
      await get().fetchAll();
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
      if (data.customIdFormat) payload.customIdFormat = data.customIdFormat;
      if (data.isPublic !== undefined) payload.isPublic = data.isPublic;

      await InventoryService.update(id, payload);
      if (data.customIdFormat) set({ customIdTemplate: data.customIdFormat });

      await get().fetchAll();
    } catch (err: any) {
      if (err.message?.includes("version mismatch")) {
        const fresh = await get().getById(id);
        set({ version: fresh.version });
        try {
          const retryPayload: any = { ...data, version: fresh.version };
          await InventoryService.update(id, retryPayload);
          await get().fetchAll();
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
      await get().fetchAll();
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

  getAll: async () => {
    const { currentUser, page, limit, search, activeTab, sorting } = get();
    if (!currentUser) return;

    set({ loading: true, error: null });

    try {
      const inventoryFilter = getInventoryFilter(activeTab);
      const queryParams = buildQueryParams({
        page,
        limit,
        search,
        sorting,
        inventoryFilter,
      });

      const data = await InventoryService.getAll(currentUser.id, queryParams);

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
  fetchAll: async () => {
    await get().getAll();
  },
}));

const getInventoryFilter = (
  tab: InventoryTabId
): InventoryFilter | undefined => {
  switch (tab) {
    case InventoryTabId.Own:
      return InventoryFilter.Own;
    case InventoryTabId.Member:
      return InventoryFilter.Member;
    case InventoryTabId.All:
      return InventoryFilter.Public;
    default:
      return undefined;
  }
};

const buildQueryParams = (options: {
  page: number;
  limit: number;
  search?: string;
  sorting?: { sortBy?: string; sortOrder?: "asc" | "desc" };
  inventoryFilter?: InventoryFilter;
}) => {
  const { page, limit, search, sorting, inventoryFilter } = options;

  return {
    page,
    limit,
    search,
    sortBy: sorting?.sortBy,
    sortOrder: sorting?.sortOrder,
    inventoryFilter,
  };
};
