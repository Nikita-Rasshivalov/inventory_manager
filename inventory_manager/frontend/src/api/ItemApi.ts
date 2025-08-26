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
    limit = 10,
    sortBy?: string,
    sortOrder?: "asc" | "desc"
  ): Promise<PaginatedItemResponse> {
    const res = await axiosInstance.get<PaginatedItemResponse>(
      `/inventory/${inventoryId}/items`,
      { params: { page, limit, sortBy, sortOrder } }
    );
    return res.data;
  }

  static async getById(inventoryId: number, itemId: number): Promise<Item> {
    const res = await axiosInstance.get<Item>(
      `/inventory/${inventoryId}/items/${itemId}`
    );
    return res.data;
  }

  static async create(inventoryId: number, data: ItemPayload): Promise<Item> {
    const res = await axiosInstance.post<Item>(
      `/inventory/${inventoryId}/items`,
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
      `/inventory/${inventoryId}/items/${itemId}`,
      data
    );
    return res.data;
  }

  static async delete(
    inventoryId: number,
    itemId: number
  ): Promise<{ message: string }> {
    const res = await axiosInstance.delete<{ message: string }>(
      `/inventory/${inventoryId}/items/${itemId}`
    );
    return res.data;
  }
}
