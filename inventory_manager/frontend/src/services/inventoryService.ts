import { InventoryApi, PaginatedInventoryResponse } from "../api/inventoryApi";
import { Inventory, InventoryPayload } from "../models/models";

export const InventoryService = {
  getAll: async (
    page: number,
    limit: number,
    search: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc"
  ): Promise<PaginatedInventoryResponse> => {
    return await InventoryApi.getAll(
      page,
      limit,
      search,
      sortBy || "",
      sortOrder || "asc"
    );
  },

  getById: async (id: number): Promise<Inventory> => {
    return await InventoryApi.getById(id);
  },

  create: async (data: InventoryPayload): Promise<Inventory> => {
    return await InventoryApi.create(data);
  },

  update: async (
    id: number,
    data: Partial<InventoryPayload>
  ): Promise<Inventory> => {
    return await InventoryApi.update(id, data);
  },

  delete: async (ids: number[]): Promise<{ message: string }> => {
    return await InventoryApi.delete(ids);
  },
};
