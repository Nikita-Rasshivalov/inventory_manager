import { prisma } from "../prisma/client.ts";
import {
  getValidFieldIds,
  prepareFieldValuesForUpdate,
  runUpdateTransaction,
  getItemOrThrow,
  checkVersion,
  generateUniqueCustomId,
} from "../utils/itemUtils.ts";
import { generateCustomId, CustomIdPart } from "../utils/customId.ts";
import { UpdateItemData } from "../models/queries.ts";

export class ItemService {
  async getAll(
    inventoryId: number,
    page = 1,
    limit = 8,
    sortBy?: string,
    sortOrder: "asc" | "desc" = "asc"
  ) {
    const skip = (page - 1) * limit;
    const orderBy: Record<string, "asc" | "desc"> = {};
    if (sortBy) orderBy[sortBy] = sortOrder;

    const [items, total] = await prisma.$transaction([
      prisma.item.findMany({
        where: { inventoryId, deleted: false },
        include: {
          fieldValues: {
            where: { deleted: false },
            include: { field: true },
            orderBy: { order: "asc" },
          },
          createdBy: true,
          likes: true,
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.item.count({ where: { inventoryId, deleted: false } }),
    ]);

    return { items, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getById(inventoryId: number, itemId: number) {
    const item = await getItemOrThrow(inventoryId, itemId);
    return prisma.item.findFirst({
      where: { id: item.id },
      include: {
        fieldValues: {
          where: { deleted: false },
          include: { field: true },
          orderBy: { order: "asc" },
        },
        createdBy: true,
        likes: true,
      },
    });
  }

  async create(inventoryId: number, userId: number) {
    const inventory = await prisma.inventory.findUnique({
      where: { id: inventoryId },
      select: { customIdFormat: true },
    });

    let customId: string | undefined;
    const raw = inventory?.customIdFormat;

    let formatParts: CustomIdPart[] = [];

    if (typeof raw === "string") {
      formatParts = JSON.parse(raw) as CustomIdPart[];
    }

    customId = await generateCustomId(inventoryId, formatParts);

    return prisma.item.create({
      data: {
        inventoryId,
        createdById: userId,
        customId,
      },
      include: {
        createdBy: true,
        likes: true,
      },
    });
  }

  async update(inventoryId: number, itemId: number, data: UpdateItemData) {
    const item = await getItemOrThrow(inventoryId, itemId);
    checkVersion(item, data.version);

    const validIdsSet = await getValidFieldIds(inventoryId);
    const { createFieldValues, updateFieldValues, deleteFieldValues } =
      await prepareFieldValuesForUpdate(
        itemId,
        data.fieldValues || [],
        validIdsSet
      );

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
