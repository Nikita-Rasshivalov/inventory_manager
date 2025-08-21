import { InventoryRole } from "@prisma/client";
import { prisma } from "../prisma/client.ts";

export class InventoryService {
  async create(title: string, ownerId: number) {
    return await prisma.inventory.create({
      data: {
        title,
        ownerId,
        members: {
          create: {
            userId: ownerId,
            role: InventoryRole.OWNER,
          },
        },
      },
      include: {
        members: true,
      },
    });
  }

  async getAll(userId: number) {
    return await prisma.inventory.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        owner: true,
        members: true,
        fields: true,
        items: true,
      },
    });
  }

  async getById(id: number, userId: number) {
    const inventory = await prisma.inventory.findFirst({
      where: {
        id,
        members: { some: { userId } },
      },
      include: {
        owner: true,
        members: true,
        fields: true,
        items: true,
      },
    });
    if (!inventory) throw new Error("Inventory not found or access denied");
    return inventory;
  }

  async update(id: number, data: Partial<{ title: string }>, userId: number) {
    const member = await prisma.inventoryMember.findUnique({
      where: { inventoryId_userId: { inventoryId: id, userId } },
    });
    if (
      !member ||
      (member.role !== InventoryRole.OWNER &&
        member.role !== InventoryRole.WRITER)
    )
      throw new Error("Access denied");

    return await prisma.inventory.update({
      where: { id },
      data,
    });
  }

  async delete(id: number, userId: number) {
    const member = await prisma.inventoryMember.findUnique({
      where: { inventoryId_userId: { inventoryId: id, userId } },
    });
    if (!member || member.role !== InventoryRole.OWNER)
      throw new Error("Access denied");

    return await prisma.inventory.delete({
      where: { id },
    });
  }

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
