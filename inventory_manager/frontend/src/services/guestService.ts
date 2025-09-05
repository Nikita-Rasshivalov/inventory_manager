import { GuestApi } from "../api/gusetApi";
import { Inventory, TopInventory } from "../models/models";

export const GuestService = {
  getLatest: async (limit: number = 10): Promise<Inventory[]> => {
    return await GuestApi.getLatest(limit);
  },

  getTop: async (): Promise<TopInventory[]> => {
    return await GuestApi.getTop();
  },
};
