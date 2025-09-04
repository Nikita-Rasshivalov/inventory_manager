import { InventoryRole, SystemRole } from "@prisma/client";
import { prisma } from "../prisma/client.ts";
import { InventoryQueryParams } from "../models/queries.ts";
import { MemberAction } from "../models/types.ts";
import { checkVersion } from "../utils/validation.ts";
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
import {
  addMember,
  updateMemberRole,
  removeMember,
} from "../utils/inventoryMembers.ts";

export class InventoryService {
  async getAll(userId: number | undefined, query: InventoryQueryParams) {
    const { page, limit, search, sortBy, sortOrder, inventoryFilter } = query;
    const skip = getSkip(page, limit);

    const orderBy =
      sortBy === "elementsCount"
        ? { items: { _count: sortOrder } }
        : buildOrderBy(sortBy, sortOrder);

    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error("User not found");

      if (user.role === SystemRole.ADMIN) {
        const [items, total] = await Promise.all([
          fetchItems({ deleted: false }, skip, limit, orderBy),
          countItems({ deleted: false }),
        ]);
        return { items, total, page, totalPages: Math.ceil(total / limit) };
      }

      const where = buildWhere(userId, search, inventoryFilter);

      const [items, total] = await Promise.all([
        fetchItems(where, skip, limit, orderBy),
        countItems(where),
      ]);

      return { items, total, page, totalPages: Math.ceil(total / limit) };
    } else {
      const where = { deleted: false, isPublic: true };
      const [items, total] = await Promise.all([
        fetchItems(where, skip, limit, orderBy),
        countItems(where),
      ]);

      return { items, total, page, totalPages: Math.ceil(total / limit) };
    }
  }

  async create(title: string, ownerId: number, isPublic = false) {
    return prisma.inventory.create({
      data: {
        title,
        ownerId,
        isPublic,
        members: { create: { userId: ownerId, role: InventoryRole.OWNER } },
      },
      include: { owner: true, members: true },
    });
  }

  async getById(id: number, userId?: number) {
    if (userId) {
      return await this.getByIdForUser(id, userId);
    }
    return await this.getByIdForGuest(id);
  }

  async getByIdForUser(id: number, userId: number) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    if (user.role === SystemRole.ADMIN) {
      return this.findInventoryById(id, true);
    } else {
      return this.findInventoryForMemberOrOwner(id, userId);
    }
  }

  async getByIdForGuest(id: number) {
    return prisma.inventory
      .findFirst({
        where: { id, isPublic: true },
        include: {
          owner: true,
          fields: true,
          items: true,
          comments: { include: { user: true } },
        },
      })
      .then((inventory) => {
        if (!inventory) throw new Error("Inventory not found or access denied");
        return inventory;
      });
  }

  async findInventoryById(id: number, includeMembers = false) {
    const inventory = await prisma.inventory.findUnique({
      where: { id },
      include: {
        owner: true,
        members: includeMembers ? { include: { user: true } } : false,
        fields: true,
        items: true,
        comments: { include: { user: true } },
      },
    });

    if (!inventory) throw new Error("Inventory not found or access denied");
    return inventory;
  }

  async findInventoryForMemberOrOwner(id: number, userId: number) {
    const inventory = await prisma.inventory.findFirst({
      where: {
        id,
        OR: [
          { isPublic: true },
          { members: { some: { userId } } },
          { ownerId: userId },
        ],
      },
      include: {
        owner: true,
        members: { include: { user: true } },
        fields: true,
        items: true,
        comments: { include: { user: true } },
      },
    });

    if (!inventory) throw new Error("Inventory not found or access denied");
    return inventory;
  }

  async update(
    id: number,
    data: Partial<{
      title: string;
      customIdFormat?: any[];
      isPublic?: boolean;
    }>,
    userId: number,
    clientVersion: number
  ) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    if (user.role === SystemRole.ADMIN) {
      return this._updateInventory(id, data, clientVersion);
    }

    const member = await checkPermission(id, userId, [
      InventoryRole.OWNER,
      InventoryRole.WRITER,
    ]);

    if (member.role === InventoryRole.WRITER && "isPublic" in data) {
      throw new Error("Writers cannot change isPublic");
    }

    return this._updateInventory(id, data, clientVersion);
  }

  private async _updateInventory(id: number, data: any, clientVersion: number) {
    const current = await prisma.inventory.findUnique({
      where: { id },
      select: { version: true },
    });
    if (!current) throw new Error("Inventory not found");
    checkVersion(current, clientVersion);

    const updateData: any = { ...data };
    if (data.customIdFormat) {
      updateData.customIdFormat = JSON.stringify(data.customIdFormat);
    }

    return prisma.inventory.update({
      where: { id },
      data: {
        ...updateData,
        version: { increment: 1 },
      },
      include: { members: true, owner: true },
    });
  }

  async delete(ids: number[], userId: number) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    if (user.role === SystemRole.ADMIN) {
      await softDeleteTransaction(ids, new Date());
      return buildBulkResponse(ids.length, 0);
    }

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
    const user = await prisma.user.findUnique({ where: { id: currentUserId } });
    if (!user) throw new Error("User not found");

    if (user.role !== SystemRole.ADMIN) {
      await checkPermission(inventoryId, currentUserId, [InventoryRole.OWNER]);
    }

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

  async getComments(inventoryId: number) {
    return prisma.comment.findMany({
      where: { inventoryId },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    });
  }

  async addComment(inventoryId: number, userId: number, content: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    if (user.role !== SystemRole.ADMIN) {
      const member = await prisma.inventoryMember.findUnique({
        where: { inventoryId_userId: { inventoryId, userId } },
      });
      if (!member) throw new Error("Access denied");
    }

    return prisma.comment.create({
      data: { inventoryId, userId, content },
      include: { user: true },
    });
  }

  async deleteComment(commentId: number, userId: number) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { user: true },
    });
    if (!comment) throw new Error("Comment not found");

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    if (comment.userId !== userId && user.role !== SystemRole.ADMIN) {
      throw new Error("Access denied");
    }

    await prisma.comment.delete({ where: { id: commentId } });
    return { success: true };
  }
}
