import { Inventory, InventoryRole, User } from "../../../models/models";

export const useInventoryFilter = (
  inventories: Inventory[],
  activeTab: string,
  user: User | null
) => {
  return inventories.filter((inv) => {
    if (!user) return false;

    switch (activeTab) {
      case InventoryRole.OWNER:
        return inv.ownerId === user.id;
      case InventoryRole.WRITER:
        return inv.members?.some(
          (m) => m.userId === user.id && m.role === InventoryRole.WRITER
        );
      case InventoryRole.READER:
        return inv.members?.some(
          (m) => m.userId === user.id && m.role === InventoryRole.READER
        );
      default:
        return false;
    }
  });
};
