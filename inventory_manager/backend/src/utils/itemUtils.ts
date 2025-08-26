import { prisma } from "../prisma/client.ts";
import { CustomIdPart, generateCustomId } from "../utils/customId.ts";

export const MAX_ID_ATTEMPTS = 5;

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
    throw { status: 409, message: "Conflict: version mismatch" };
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
  return { createFieldValues, updateFieldValues, deleteFieldValues };
}

export async function runUpdateTransaction(
  itemId: number,
  data: any,
  createFieldValues: any[],
  updateFieldValues: any[],
  deleteFieldValues: any[]
) {
  const transactionOps = [
    prisma.item.update({
      where: { id: itemId },
      data: { ...data, version: { increment: 1 } },
    }),
    ...updateFieldValues.map((fv) =>
      prisma.itemFieldValue.update({
        where: { id: fv.id },
        data: { value: fv.value },
      })
    ),
    ...createFieldValues.map((fv) =>
      prisma.itemFieldValue.create({
        data: { itemId, fieldId: fv.fieldId, value: fv.value },
      })
    ),
    ...deleteFieldValues.map((fv) =>
      prisma.itemFieldValue.update({
        where: { id: fv.id },
        data: { deleted: true, deletedAt: new Date() },
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
