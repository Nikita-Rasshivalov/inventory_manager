import { InventoryApi, PaginatedInventoryResponse } from "../api/inventoryApi";
import {
  Inventory,
  InventoryPayload,
  InventoryRole,
  MemberAction,
  Comment,
  InventoryFilter,
} from "../models/models";

export const InventoryService = {
  getAll: async (
    userId: number,
    params: {
      page: number;
      limit: number;
      search?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
      inventoryFilter?: InventoryFilter;
    }
  ): Promise<PaginatedInventoryResponse> => {
    return await InventoryApi.getAll({
      userId,
      ...params,
    });
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

  updateMembers: async (
    inventoryId: number,
    updates: {
      userId: number;
      role?: InventoryRole;
      action: MemberAction;
    }[]
  ): Promise<any> => {
    return await InventoryApi.updateMembers(inventoryId, updates);
  },

  getComments: async (inventoryId: number): Promise<Comment[]> => {
    return await InventoryApi.getComments(inventoryId);
  },

  deleteComment: async (
    inventoryId: number,
    commentId: number
  ): Promise<{ id: number }> => {
    return await InventoryApi.deleteComment(inventoryId, commentId);
  },
};
