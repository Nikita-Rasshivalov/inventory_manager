import { ItemApi, PaginatedItemResponse } from "../api/ItemApi";
import { Item, ItemPayload } from "../models/models";

export const ItemService = {
  getAll: async (
    inventoryId: number,
    page: number,
    limit: number
  ): Promise<PaginatedItemResponse> => {
    return await ItemApi.getAll(inventoryId, page, limit);
  },

  getById: async (inventoryId: number, itemId: number): Promise<Item> => {
    return await ItemApi.getById(inventoryId, itemId);
  },

  create: async (inventoryId: number, data: ItemPayload): Promise<Item> => {
    return await ItemApi.create(inventoryId, data);
  },

  update: async (
    inventoryId: number,
    itemId: number,
    data: Partial<ItemPayload>
  ): Promise<Item> => {
    return await ItemApi.update(inventoryId, itemId, data);
  },

  delete: async (
    inventoryId: number,
    itemId: number
  ): Promise<{ message: string }> => {
    return await ItemApi.delete(inventoryId, itemId);
  },
};
