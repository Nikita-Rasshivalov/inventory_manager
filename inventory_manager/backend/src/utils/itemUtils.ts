import { prisma } from "../prisma/client.ts";
import { CustomIdPart, generateCustomId } from "../utils/customId.ts";

export const MAX_ID_ATTEMPTS = 5;

const FIELD_TYPE_LIMITS: Record<string, number> = {
  text: 3,
  textarea: 3,
  number: 3,
  file: 3,
  boolean: 3,
};

export async function getValidFieldIds(
  inventoryId: number
): Promise<Set<number>> {
  const validFields = await prisma.field.findMany({
    where: { inventoryId, deleted: false },
    select: { id: true },
  });
  return new Set(validFields.map((f) => f.id));
}

export function prepareFieldValues(
  fieldValues: any[],
  validIdsSet: Set<number>,
  withId: boolean
) {
  return (fieldValues || [])
    .filter((fv) =>
      withId
        ? fv.id && validIdsSet.has(fv.fieldId)
        : !fv.id && validIdsSet.has(fv.fieldId)
    )
    .map((fv) =>
      withId
        ? { id: fv.id, value: fv.value }
        : { fieldId: fv.fieldId, value: fv.value }
    );
}

export async function getItemOrThrow(inventoryId: number, itemId: number) {
  const item = await prisma.item.findFirst({
    where: { id: itemId, inventoryId },
  });
  if (!item) throw new Error("Item not found");
  return item;
}

export function checkVersion(item: any, clientVersion: number) {
  if (clientVersion !== item.version)
    throw new Error("Conflict: version mismatch");
}

async function getFieldsByIds(validIdsSet: Set<number>) {
  return prisma.field.findMany({
    where: { id: { in: [...validIdsSet] }, deleted: false },
    select: { id: true, type: true },
  });
}

function countFieldTypes(fields: { id: number; type: string }[]) {
  return fields.reduce<Record<string, number>>((acc, field) => {
    acc[field.type] = (acc[field.type] || 0) + 1;
    return acc;
  }, {});
}

function checkFieldTypeLimits(
  createFieldValues: any[],
  fieldMap: Map<number, string>,
  typeCount: Record<string, number>
) {
  for (const { fieldId } of createFieldValues) {
    const type = fieldMap.get(fieldId);
    if (!type) continue;

    const limit = FIELD_TYPE_LIMITS[type];
    if (limit && (++typeCount[type] || (typeCount[type] = 1)) > limit) {
      throw new Error(`Exceeded max fields of type ${type} (limit ${limit})`);
    }
  }
}

export async function prepareFieldValuesForUpdate(
  itemId: number,
  fieldValues: any[],
  validIdsSet: Set<number>
) {
  const createFieldValues = prepareFieldValues(fieldValues, validIdsSet, false);
  const updateFieldValues = prepareFieldValues(fieldValues, validIdsSet, true);

  const existingIds = updateFieldValues.map((fv) => fv.id);
  const deleteFieldValues = await prisma.itemFieldValue.findMany({
    where: { itemId, deleted: false, NOT: { id: { in: existingIds } } },
    select: { id: true },
  });
  const fields = await getFieldsByIds(validIdsSet);
  const fieldMap = new Map(fields.map((f) => [f.id, f.type]));

  const typeCount = countFieldTypes(fields);

  checkFieldTypeLimits(createFieldValues, fieldMap, typeCount);

  return { createFieldValues, updateFieldValues, deleteFieldValues };
}

export async function runUpdateTransaction(
  itemId: number,
  data: any,
  createFieldValues: any[],
  updateFieldValues: any[],
  deleteFieldValues: any[]
) {
  const { fieldValues, ...updateData } = data;

  const itemUpdateData = {
    ...updateData,
    version: { increment: 1 },
  };

  const transactionOps = [
    prisma.item.update({
      where: { id: itemId },
      data: itemUpdateData,
    }),
    ...updateFieldValues.map((fv) =>
      prisma.itemFieldValue.update({
        where: { id: fv.id },
        data: {
          value: fv.value,
          order: fv.order ?? 0,
          showInTable: fv.showInTable ?? true,
        },
      })
    ),
    ...createFieldValues.map((fv) =>
      prisma.itemFieldValue.create({
        data: {
          itemId,
          fieldId: fv.fieldId,
          value: fv.value,
          order: fv.order ?? 0,
          showInTable: fv.showInTable ?? true,
        },
      })
    ),
    ...deleteFieldValues.map((fv) =>
      prisma.itemFieldValue.delete({
        where: { id: fv.id },
      })
    ),
  ];

  await prisma.$transaction(transactionOps);
}

export async function generateUniqueCustomId(
  inventoryId: number,
  customIdFormat?: CustomIdPart[]
): Promise<string | undefined> {
  if (!customIdFormat) return undefined;

  let attempt = 0;
  while (attempt < MAX_ID_ATTEMPTS) {
    const customId = await generateCustomId(inventoryId, customIdFormat);
    const exists = await prisma.item.findFirst({
      where: { inventoryId, customId },
    });
    if (!exists) return customId;
    attempt++;
  }
  throw new Error("Cannot generate unique customId after multiple attempts");
}
