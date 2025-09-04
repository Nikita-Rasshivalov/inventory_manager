import { PrismaClient, InventoryRole, SystemRole } from "@prisma/client";
import { InventoryFilter } from "../models/types.ts";

const prisma = new PrismaClient();

export async function checkPermission(
  inventoryId: number,
  userId: number,
  allowedRoles: InventoryRole[]
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (user?.role === SystemRole.ADMIN) {
    return { inventoryId, userId, role: InventoryRole.OWNER };
  }

  const member = await prisma.inventoryMember.findUnique({
    where: { inventoryId_userId: { inventoryId, userId } },
  });

  if (!member || !allowedRoles.includes(member.role)) {
    throw new Error("Access denied");
  }

  return member;
}

export function getSkip(page: number, limit: number) {
  return (page - 1) * limit;
}

export function buildOrderBy(sortBy?: string, sortOrder?: "asc" | "desc") {
  if (!sortBy) return undefined;

  switch (sortBy) {
    case "owner":
      return [{ owner: { name: sortOrder || "asc" } }, { createdAt: "asc" }];
    case "created":
      return [{ createdAt: sortOrder || "asc" }, { owner: { name: "asc" } }];
    default:
      return undefined;
  }
}
export function buildWhere(
  userId: number,
  search?: string,
  filter?: InventoryFilter
) {
  const where: any = { deleted: false };

  switch (filter) {
    case InventoryFilter.Own:
      where.ownerId = userId;
      break;
    case InventoryFilter.Member:
      where.members = {
        some: { userId, role: InventoryRole.WRITER, deleted: false },
      };
      break;
    case InventoryFilter.Public:
      where.isPublic = true;
      break;
    default:
      where.OR = [
        { isPublic: true },
        { ownerId: userId },
        { members: { some: { userId, deleted: false } } },
      ];
      break;
  }

  if (search && search.trim() !== "") {
    where.title = { contains: search };
  }

  return where;
}

export async function fetchItems(
  where: any,
  skip: number,
  limit: number,
  orderBy?: any
) {
  return prisma.inventory.findMany({
    where,
    skip,
    take: limit,
    orderBy: orderBy ?? {},
    include: {
      owner: true,
      members: { where: { deleted: false } },
      items: true,
    },
  });
}

export async function countItems(where: any) {
  return prisma.inventory.count({ where });
}

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
