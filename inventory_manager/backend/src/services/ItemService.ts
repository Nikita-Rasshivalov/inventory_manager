import { prisma } from "../prisma/client.ts";
import { generateCustomId, CustomIdPart } from "../utils/customId.ts";

export class ItemService {
  async getAll(inventoryId: number) {
    return prisma.item.findMany({
      where: { inventoryId, deleted: false },
      include: {
        fieldValues: true,
        createdBy: true,
        likes: true,
        comments: true,
      },
    });
  }

  async getById(inventoryId: number, itemId: number) {
    const item = await prisma.item.findFirst({
      where: { id: itemId, inventoryId, deleted: false },
      include: {
        fieldValues: true,
        createdBy: true,
        likes: true,
        comments: true,
      },
    });
    if (!item) throw new Error("Item not found");
    return item;
  }

  async create(
    inventoryId: number,
    userId: number,
    data: any,
    customIdFormat?: CustomIdPart[]
  ) {
    const customId = customIdFormat
      ? await generateCustomId(inventoryId, customIdFormat)
      : undefined;

    const fieldValuesData = (data.fieldValues || []).map((fv: any) => ({
      fieldId: fv.fieldId,
      value: fv.value,
    }));

    const item = await prisma.item.create({
      data: {
        inventoryId,
        createdById: userId,
        customId,
        fieldValues: { create: fieldValuesData },
      },
      include: {
        fieldValues: true,
        createdBy: true,
        likes: true,
        comments: true,
      },
    });

    return item;
  }

  async update(inventoryId: number, itemId: number, data: any) {
    const item = await prisma.item.findFirst({
      where: { id: itemId, inventoryId },
    });
    if (!item) throw new Error("Item not found");

    if (data.version !== item.version) {
      throw new Error("Conflict: version mismatch");
    }

    const fieldValuesData = (data.fieldValues || []).map((fv: any) => ({
      id: fv.id,
      value: fv.value,
    }));

    const updated = await prisma.item.update({
      where: { id: itemId },
      data: {
        ...data,
        version: { increment: 1 },
        fieldValues: {
          updateMany: fieldValuesData.map((fv: any) => ({
            where: { id: fv.id },
            data: { value: fv.value },
          })),
        },
      },
      include: {
        fieldValues: true,
        createdBy: true,
        likes: true,
        comments: true,
      },
    });

    return updated;
  }

  async delete(inventoryId: number, itemId: number) {
    return prisma.item.update({
      where: { id: itemId },
      data: { deleted: true, deletedAt: new Date() },
    });
  }
}
