import { prisma } from "../../prisma/client.ts";
import { InventoryRole } from "../../models/types.ts";

export class InventoryService {
  async getUserRole(
    userId: number,
    inventoryId: string
  ): Promise<InventoryRole | null> {
    const record = await prisma.inventoryUser.findUnique({
      where: {
        userId_inventoryId: { userId, inventoryId },
      },
      select: {
        role: true,
      },
    });

    return record?.role ?? null;
  }
}
