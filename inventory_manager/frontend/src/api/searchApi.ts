import axiosInstance from "../services/axiosInstance";
import { Inventory } from "../models/models";

export const SearchApi = {
  async getByTag(tag: string): Promise<Inventory[]> {
    const res = await axiosInstance.get<Inventory[]>(
      `/guest/inventories/by-tag/${encodeURIComponent(tag)}`
    );
    return res.data;
  },
};
