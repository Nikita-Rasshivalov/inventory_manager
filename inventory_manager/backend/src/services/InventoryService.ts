import { InventoryRole } from "@prisma/client";
import { prisma } from "../prisma/client.ts";
import {
  getUserMemberships,
  splitAllowedAndSkipped,
  softDeleteTransaction,
  buildBulkResponse,
} from "../utils/inventoryUtils.ts";

export class InventoryService {
  private async checkPermission(
    inventoryId: number,
    userId: number,
    allowedRoles: InventoryRole[]
  ) {
    const member = await prisma.inventoryMember.findUnique({
      where: { inventoryId_userId: { inventoryId, userId } },
    });
    if (!member || !allowedRoles.includes(member.role)) {
      throw new Error("Access denied");
    }
    return member;
  }

  async create(title: string, ownerId: number) {
    return prisma.inventory.create({
      data: {
        title,
        ownerId,
        members: { create: { userId: ownerId, role: InventoryRole.OWNER } },
      },
      include: { owner: true, members: true },
    });
  }

  async getAll(userId: number) {
    return prisma.inventory.findMany({
      where: {
        deleted: false,
        members: { some: { userId, deleted: false } },
      },
      include: {
        owner: true,
        members: { where: { deleted: false } },
        fields: { where: { deleted: false } },
        items: {
          where: { deleted: false },
          include: {
            fieldValues: { where: { deleted: false } },
            comments: { where: { deleted: false } },
            likes: { where: { deleted: false } },
          },
        },
      },
    });
  }

  async getById(id: number, userId: number) {
    const inventory = await prisma.inventory.findFirst({
      where: { id, members: { some: { userId } } },
      include: { owner: true, members: true, fields: true, items: true },
    });
    if (!inventory) throw new Error("Inventory not found or access denied");
    return inventory;
  }

  async update(id: number, data: Partial<{ title: string }>, userId: number) {
    await this.checkPermission(id, userId, [
      InventoryRole.OWNER,
      InventoryRole.WRITER,
    ]);

    return prisma.inventory.update({
      where: { id },
      data,
      include: { members: true, owner: true },
    });
  }

  async delete(ids: number[], userId: number) {
    const memberships = await getUserMemberships(userId, ids);
    const { allowedIds, skippedIds } = splitAllowedAndSkipped(
      memberships,
      InventoryRole.OWNER
    );

    if (!allowedIds.length)
      throw new Error("Access denied for all inventories");

    await softDeleteTransaction(allowedIds, new Date());

    return buildBulkResponse(allowedIds.length, skippedIds.length);
  }
  async getUserRole(
    userId: number,
    inventoryId: number
  ): Promise<InventoryRole | null> {
    const record = await prisma.inventoryMember.findUnique({
      where: { inventoryId_userId: { inventoryId, userId } },
      select: { role: true },
    });
    return record?.role ?? null;
  }
}
