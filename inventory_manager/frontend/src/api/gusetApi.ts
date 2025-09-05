import { Inventory, TopInventory } from "../models/models";
import axiosInstance from "../services/axiosInstance";

export class GuestApi {
  static async getLatest(limit: number = 10): Promise<Inventory[]> {
    const response = await axiosInstance.get<Inventory[]>("/guest/latest", {
      params: { limit },
    });
    return response.data;
  }

  static async getTop(): Promise<TopInventory[]> {
    const response = await axiosInstance.get<TopInventory[]>("/guest/top");
    return response.data;
  }
}
