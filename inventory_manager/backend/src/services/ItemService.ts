import { prisma } from "../prisma/client.ts";
import {
  getValidFieldIds,
  prepareFieldValuesForUpdate,
  runUpdateTransaction,
  getItemOrThrow,
  checkVersion,
  generateUniqueCustomId,
} from "../utils/itemUtils.ts";
import { CustomIdPart } from "../utils/customId.ts";

export class ItemService {
  async getAll(
    inventoryId: number,
    page = 1,
    limit = 8,
    sortBy: string,
    sortOrder: "asc" | "desc"
  ) {
    const skip = (page - 1) * limit;
    const orderBy: Record<string, "asc" | "desc"> = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder;
    }

    const [items, total] = await prisma.$transaction([
      prisma.item.findMany({
        where: { inventoryId, deleted: false },
        include: {
          fieldValues: true,
          createdBy: true,
          likes: true,
          comments: true,
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.item.count({ where: { inventoryId, deleted: false } }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return { items, total, page, totalPages };
  }

  async getById(inventoryId: number, itemId: number) {
    return getItemOrThrow(inventoryId, itemId).then((item) =>
      prisma.item.findFirst({
        where: { id: item.id },
        include: {
          fieldValues: true,
          createdBy: true,
          likes: true,
          comments: true,
        },
      })
    );
  }

  async create(
    inventoryId: number,
    userId: number,
    data: any,
    customIdFormat?: CustomIdPart[]
  ) {
    const validIdsSet = await getValidFieldIds(inventoryId);
    const fieldValues = (data.fieldValues || []).filter((fv: any) =>
      validIdsSet.has(fv.fieldId)
    );

    const customId = await generateUniqueCustomId(inventoryId, customIdFormat);

    const item = await prisma.item.create({
      data: {
        inventoryId,
        createdById: userId,
        customId,
        fieldValues: {
          create: fieldValues.map((fv: any) => ({
            fieldId: fv.fieldId,
            value: fv.value,
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

    return item;
  }

  async update(inventoryId: number, itemId: number, data: any) {
    const item = await getItemOrThrow(inventoryId, itemId);
    checkVersion(item, data.version);

    const validIdsSet = await getValidFieldIds(inventoryId);

    const { createFieldValues, updateFieldValues, deleteFieldValues } =
      await prepareFieldValuesForUpdate(itemId, data.fieldValues, validIdsSet);

    if (data.customIdFormat) {
      data.customId = await generateUniqueCustomId(
        inventoryId,
        data.customIdFormat
      );
    }

    await runUpdateTransaction(
      itemId,
      data,
      createFieldValues,
      updateFieldValues,
      deleteFieldValues
    );

    return this.getById(inventoryId, itemId);
  }

  async delete(inventoryId: number, itemId: number) {
    await getItemOrThrow(inventoryId, itemId);
    return prisma.item.update({
      where: { id: itemId },
      data: { deleted: true, deletedAt: new Date() },
    });
  }
}
