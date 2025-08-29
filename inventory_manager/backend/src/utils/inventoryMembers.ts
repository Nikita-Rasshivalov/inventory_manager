import { InventoryRole } from "@prisma/client";
import { prisma } from "../prisma/client.ts";

export const addMember = async (
  inventoryId: number,
  userId: number,
  role?: InventoryRole
) => {
  return prisma.inventoryMember.upsert({
    where: { inventoryId_userId: { inventoryId, userId } },
    update: {
      deleted: false,
      deletedAt: null,
      role: role ?? InventoryRole.READER,
    },
    create: { inventoryId, userId, role: role ?? InventoryRole.READER },
  });
};

export const updateMemberRole = async (
  inventoryId: number,
  userId: number,
  role: InventoryRole
) => {
  return prisma.inventoryMember.update({
    where: { inventoryId_userId: { inventoryId, userId } },
    data: { role },
  });
};

export const removeMember = async (inventoryId: number, userId: number) => {
  return prisma.inventoryMember.delete({
    where: { inventoryId_userId: { inventoryId, userId } },
  });
};
