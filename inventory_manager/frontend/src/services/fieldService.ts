import { FieldApi } from "../api/fieldApi";
import { Field, FieldPayload } from "../models/models";

export const FieldService = {
  getAll: async (inventoryId: number): Promise<Field[]> => {
    return await FieldApi.getAll(inventoryId);
  },

  getById: async (inventoryId: number, fieldId: number): Promise<Field> => {
    return await FieldApi.getById(inventoryId, fieldId);
  },

  create: async (inventoryId: number, data: FieldPayload): Promise<Field> => {
    return await FieldApi.create(inventoryId, data);
  },

  update: async (
    inventoryId: number,
    fieldId: number,
    data: Partial<FieldPayload>
  ): Promise<Field> => {
    return await FieldApi.update(inventoryId, fieldId, data);
  },

  delete: async (
    inventoryId: number,
    fieldId: number
  ): Promise<{ message: string }> => {
    return await FieldApi.delete(inventoryId, fieldId);
  },
};
