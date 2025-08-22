import { useCallback } from "react";
import { toast } from "react-toastify";
import { useAuthProvider } from "../../../hooks/useAuthProvider";
import { useInventoryStore } from "../../../stores/useInventoryStore";

export const useInventoryActions = () => {
  const { inventories, getAll, create, delete: remove } = useInventoryStore();
  const { user } = useAuthProvider();

  const loadInventories = useCallback(async () => {
    try {
      await getAll();
    } catch {
      toast.error("Failed to load inventories");
    }
  }, [getAll]);

  const createInventory = useCallback(
    async (title: string) => {
      if (!user) return;
      try {
        await create({ title, ownerId: user.id });
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
    loadInventories,
    createInventory,
    deleteInventories,
    user,
  };
};
