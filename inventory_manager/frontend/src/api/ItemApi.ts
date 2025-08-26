import { Item, ItemPayload } from "../models/models";
import axiosInstance from "../services/axiosInstance";

export interface PaginatedItemResponse {
  items: Item[];
  total: number;
  page: number;
  totalPages: number;
}

export class ItemApi {
  static async getAll(
    inventoryId: number,
    page = 1,
    limit = 12,
    sortBy?: string,
    sortOrder?: "asc" | "desc"
  ): Promise<PaginatedItemResponse> {
    const res = await axiosInstance.get<PaginatedItemResponse>(
      `/inventory/items/${inventoryId}`,
      { params: { page, limit, sortBy, sortOrder } }
    );
    return res.data;
  }

  static async getById(inventoryId: number, itemId: number): Promise<Item> {
    const res = await axiosInstance.get<Item>(
      `/inventory/items/${inventoryId}/${itemId}`
    );
    return res.data;
  }

  static async create(inventoryId: number, data: ItemPayload): Promise<Item> {
    const res = await axiosInstance.post<Item>(
      `/inventory/items/${inventoryId}`,
      data
    );
    return res.data;
  }

  static async update(
    inventoryId: number,
    itemId: number,
    data: Partial<ItemPayload>
  ): Promise<Item> {
    const res = await axiosInstance.put<Item>(
      `/inventory/items/${inventoryId}/${itemId}`,
      data
    );
    return res.data;
  }

  static async delete(
    inventoryId: number,
    itemId: number
  ): Promise<{ message: string }> {
    const res = await axiosInstance.delete<{ message: string }>(
      `/inventory/items/${inventoryId}/${itemId}`
    );
    return res.data;
  }
}
