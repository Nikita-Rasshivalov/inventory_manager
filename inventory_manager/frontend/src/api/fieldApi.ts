import axiosInstance from "../services/axiosInstance";
import { Field, FieldPayload } from "../models/models";

export class FieldApi {
  static async getAll(inventoryId: number): Promise<Field[]> {
    const res = await axiosInstance.get<Field[]>(
      `/inventory/${inventoryId}/fields`
    );
    return res.data;
  }

  static async getById(inventoryId: number, fieldId: number): Promise<Field> {
    const res = await axiosInstance.get<Field>(
      `/inventory/${inventoryId}/fields/${fieldId}`
    );
    return res.data;
  }

  static async create(inventoryId: number, data: FieldPayload): Promise<Field> {
    const res = await axiosInstance.post<Field>(
      `/inventory/${inventoryId}/fields`,
      data
    );
    return res.data;
  }

  static async update(
    inventoryId: number,
    fieldId: number,
    data: Partial<FieldPayload>
  ): Promise<Field> {
    const res = await axiosInstance.put<Field>(
      `/inventory/${inventoryId}/fields/${fieldId}`,
      data
    );
    return res.data;
  }

  static async delete(
    inventoryId: number,
    fieldId: number
  ): Promise<{ message: string }> {
    const res = await axiosInstance.delete<{ message: string }>(
      `/inventory/${inventoryId}/fields/${fieldId}`
    );
    return res.data;
  }
}
