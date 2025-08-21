import { PrismaClient, InventoryRole } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUserMemberships(
  userId: number,
  inventoryIds: number[]
) {
  if (!inventoryIds.length) return [];
  return prisma.inventoryMember.findMany({
    where: {
      userId,
      inventoryId: { in: inventoryIds },
    },
    select: { inventoryId: true, role: true },
  });
}

export function splitAllowedAndSkipped(
  memberships: { inventoryId: number; role: InventoryRole }[],
  allowedRole: InventoryRole
) {
  const allowedIds = memberships
    .filter((m) => m.role === allowedRole)
    .map((m) => m.inventoryId);

  const skippedIds = memberships
    .filter((m) => m.role !== allowedRole)
    .map((m) => m.inventoryId);

  return { allowedIds, skippedIds };
}

export async function softDeleteTransaction(inventoryIds: number[], now: Date) {
  if (!inventoryIds.length) return;

  const items = await prisma.item.findMany({
    where: { inventoryId: { in: inventoryIds } },
    select: { id: true },
  });
  const itemIds = items.map((i) => i.id);

  await prisma.$transaction([
    prisma.inventoryMember.updateMany({
      where: { inventoryId: { in: inventoryIds } },
      data: { deleted: true, deletedAt: now },
    }),
    prisma.field.updateMany({
      where: { inventoryId: { in: inventoryIds } },
      data: { deleted: true, deletedAt: now },
    }),
    prisma.itemFieldValue.updateMany({
      where: { itemId: { in: itemIds } },
      data: { deleted: true, deletedAt: now },
    }),
    prisma.comment.updateMany({
      where: { itemId: { in: itemIds } },
      data: { deleted: true, deletedAt: now },
    }),
    prisma.like.updateMany({
      where: { itemId: { in: itemIds } },
      data: { deleted: true, deletedAt: now },
    }),
    prisma.item.updateMany({
      where: { id: { in: itemIds } },
      data: { deleted: true, deletedAt: now },
    }),
    prisma.inventory.updateMany({
      where: { id: { in: inventoryIds } },
      data: { deleted: true, deletedAt: now },
    }),
  ]);
}

export function buildBulkResponse(allowedCount: number, skippedCount: number) {
  const messages = [];
  if (allowedCount) messages.push(`Deleted ${allowedCount} inventories`);
  if (skippedCount) messages.push(`${skippedCount} skipped (no permission)`);
  return { message: messages.join("; ") };
}
