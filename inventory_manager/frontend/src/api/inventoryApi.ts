import {
  Inventory,
  InventoryPayload,
  InventoryRole,
  MemberAction,
} from "../models/models";
import axiosInstance from "../services/axiosInstance";

export interface PaginatedInventoryResponse {
  items: Inventory[];
  total: number;
  page: number;
  totalPages: number;
}

export interface InventoryMemberUpdate {
  userId: number;
  role?: InventoryRole;
  action: MemberAction;
}
export class InventoryApi {
  static async getAll(
    page: number,
    limit: number,
    search: string,
    sortBy: string = "",
    sortOrder: "asc" | "desc" = "asc",
    role?: InventoryRole
  ): Promise<PaginatedInventoryResponse> {
    const res = await axiosInstance.get<PaginatedInventoryResponse>(
      "/inventory",
      {
        params: { page, limit, search, sortBy, sortOrder, role },
      }
    );
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

  static async updateMembers(
    inventoryId: number,
    updates: InventoryMemberUpdate[]
  ): Promise<any> {
    const res = await axiosInstance.patch(`/inventory/${inventoryId}/members`, {
      updates,
    });
    return res.data;
  }
}
