import { prisma } from "../prisma/client.ts";
import { InventoryRole } from "@prisma/client";
import { checkPermission } from "../utils/inventoryUtils.ts";

export class FieldService {
  async getAll(inventoryId: number, userId: number) {
    await checkPermission(inventoryId, userId, [
      InventoryRole.OWNER,
      InventoryRole.WRITER,
      InventoryRole.READER,
    ]);

    return prisma.field.findMany({
      where: { inventoryId, deleted: false },
      orderBy: { id: "asc" },
    });
  }

  async getById(inventoryId: number, fieldId: number, userId: number) {
    await checkPermission(inventoryId, userId, [
      InventoryRole.OWNER,
      InventoryRole.WRITER,
      InventoryRole.READER,
    ]);

    const field = await prisma.field.findFirst({
      where: { id: fieldId, inventoryId, deleted: false },
    });

    if (!field) throw new Error("Field not found");
    return field;
  }

  async create(
    inventoryId: number,
    userId: number,
    name: string,
    type: string
  ) {
    await checkPermission(inventoryId, userId, [
      InventoryRole.OWNER,
      InventoryRole.WRITER,
    ]);

    return prisma.field.create({
      data: { inventoryId, name, type },
    });
  }

  async update(
    inventoryId: number,
    fieldId: number,
    userId: number,
    data: { name?: string; type?: string }
  ) {
    await checkPermission(inventoryId, userId, [
      InventoryRole.OWNER,
      InventoryRole.WRITER,
    ]);

    return prisma.field.update({
      where: { id: fieldId },
      data,
    });
  }

  async delete(inventoryId: number, fieldId: number, userId: number) {
    await checkPermission(inventoryId, userId, [
      InventoryRole.OWNER,
      InventoryRole.WRITER,
    ]);

    return prisma.field.update({
      where: { id: fieldId },
      data: { deleted: true, deletedAt: new Date() },
    });
  }
}
