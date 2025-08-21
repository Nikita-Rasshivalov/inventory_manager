import { Inventory, InventoryPayload } from "../models/models";
import axiosInstance from "../services/axiosInstance";

export class InventoryApi {
  static async getAll(): Promise<Inventory[]> {
    const res = await axiosInstance.get<Inventory[]>("/inventory");
    return res.data;
  }

  static async getById(inventoryId: number): Promise<Inventory> {
    const res = await axiosInstance.get<Inventory>(`/inventory/${inventoryId}`);
    return res.data;
  }

  static async create(data: InventoryPayload): Promise<Inventory> {
    const res = await axiosInstance.post<Inventory>("/inventory", data);
    return res.data;
  }

  static async update(
    inventoryId: number,
    data: Partial<InventoryPayload>
  ): Promise<Inventory> {
    const res = await axiosInstance.put<Inventory>(
      `/inventory/${inventoryId}`,
      data
    );
    return res.data;
  }

  static async delete(inventoryIds: number[]): Promise<{ message: string }> {
    const res = await axiosInstance.request<{ message: string }>({
      method: "delete",
      url: `/inventory`,
      headers: { "Content-Type": "application/json" },
      data: { ids: inventoryIds } as any,
    });
    return res.data;
  }
}
