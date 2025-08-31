import { InventoryRole } from "@prisma/client";
import { prisma } from "../prisma/client.ts";
import {
  getUserMemberships,
  splitAllowedAndSkipped,
  softDeleteTransaction,
  buildBulkResponse,
  checkPermission,
  buildWhere,
  buildOrderBy,
  countItems,
  fetchItems,
  getSkip,
} from "../utils/inventoryUtils.ts";
import { InventoryQueryParams } from "../models/queries.ts";
import {
  addMember,
  updateMemberRole,
  removeMember,
} from "../utils/inventoryMembers.ts";
import { MemberAction } from "../models/types.ts";

export class InventoryService {
  async getAll(userId: number, query: InventoryQueryParams) {
    const { page, limit, search, sortBy, sortOrder, role } = query;

    const skip = getSkip(page, limit);
    const where = buildWhere(userId, search, role);
    const orderBy = buildOrderBy(sortBy, sortOrder);

    const [items, total] = await Promise.all([
      fetchItems(where, skip, limit, orderBy),
      countItems(where),
    ]);

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
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

  async getById(id: number, userId: number) {
    const inventory = await prisma.inventory.findFirst({
      where: { id, members: { some: { userId } } },
      include: {
        owner: true,
        members: {
          include: {
            user: true,
          },
        },
        fields: true,
        items: true,
      },
    });
    if (!inventory) throw new Error("Inventory not found or access denied");
    return inventory;
  }

  async update(
    id: number,
    data: Partial<{ title: string; customIdFormat?: any[] }>,
    userId: number
  ) {
    await checkPermission(id, userId, [
      InventoryRole.OWNER,
      InventoryRole.WRITER,
    ]);
    const updateData: any = { ...data };

    if (data.customIdFormat) {
      updateData.customIdFormat = JSON.stringify(data.customIdFormat);
    }

    return prisma.inventory.update({
      where: { id },
      data: updateData,
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

  async updateMembers(
    inventoryId: number,
    currentUserId: number,
    updates: Array<{
      userId: number;
      role?: InventoryRole;
      action: MemberAction;
    }>
  ) {
    await checkPermission(inventoryId, currentUserId, [InventoryRole.OWNER]);

    const promises = updates.map(({ userId, role, action }) => {
      switch (action) {
        case MemberAction.Add:
          return addMember(inventoryId, userId, role);
        case MemberAction.Update:
          if (!role) throw new Error("Role is required for update");
          return updateMemberRole(inventoryId, userId, role);
        case MemberAction.Remove:
          return removeMember(inventoryId, userId);
        default:
          throw new Error(`Unknown action: ${action}`);
      }
    });

    return Promise.all(promises);
  }
}
