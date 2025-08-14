import { InventoryRole } from "@prisma/client";
import { prisma } from "../../prisma/client.ts";
export class InventoryService {
  async getUserRole(
    userId: number,
    inventoryId: number
  ): Promise<InventoryRole | null> {
    const record = await prisma.inventoryMember.findUnique({
      where: {
        inventoryId_userId: { inventoryId, userId },
      },
      select: {
        role: true,
      },
    });

    return record?.role ?? null;
  }
}
