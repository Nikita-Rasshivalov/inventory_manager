import { useCallback } from "react";
import { toast } from "react-toastify";
import { useAuthProvider } from "../../../hooks/useAuthProvider";
import { useInventoryStore } from "../../../stores/useInventoryStore";
import { InventoryPayload } from "../../../models/models";

export const useInventoryActions = () => {
  const { inventories, create, delete: remove } = useInventoryStore();
  const { user } = useAuthProvider();

  const createInventory = useCallback(
    async (data: { title: string; isPublic?: boolean }) => {
      if (!user) return;
      const payload: InventoryPayload = {
        title: data.title,
        version: 0,
        isPublic: data.isPublic ?? false,
      };

      try {
        await create(payload);
        toast.success("Inventory created successfully");
      } catch (err: any) {
        toast.error(err.message || "Failed to create inventory");
      }
    },
    [create, user]
  );

  const deleteInventories = useCallback(
    async (ids: number[]) => {
      try {
        const message = await remove(ids);
        toast.success(message);
      } catch (err: any) {
        toast.error(err.message || "Failed to delete inventories");
      }
    },
    [remove]
  );

  return {
    inventories,
    createInventory,
    deleteInventories,
    user,
  };
};
