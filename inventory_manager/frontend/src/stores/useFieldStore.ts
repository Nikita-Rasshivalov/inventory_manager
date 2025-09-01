import { create } from "zustand";
import { Field, FieldPayload } from "../models/models";
import { FieldService } from "../services/fieldService";

interface FieldStoreState {
  fields: Field[];
  loading: boolean;
  error: string | null;

  getAll: (inventoryId: number) => Promise<void>;
  getById: (inventoryId: number, fieldId: number) => Promise<Field | null>;
  create: (inventoryId: number, data: FieldPayload) => Promise<Field | null>;
  update: (
    inventoryId: number,
    fieldId: number,
    data: Partial<FieldPayload>
  ) => Promise<Field | null>;
  remove: (inventoryId: number, fieldId: number) => Promise<boolean>;
}

export const useFieldStore = create<FieldStoreState>((set, get) => ({
  fields: [],
  loading: false,
  error: null,

  getAll: async (inventoryId: number) => {
    set({ loading: true, error: null });
    try {
      const fields = await FieldService.getAll(inventoryId);
      set({ fields, loading: false });
    } catch (err: any) {
      set({ error: err?.message || "Failed to fetch fields", loading: false });
    }
  },

  getById: async (inventoryId: number, fieldId: number) => {
    set({ loading: true, error: null });
    try {
      const field = await FieldService.getById(inventoryId, fieldId);
      set({ loading: false });
      return field;
    } catch (err: any) {
      set({ error: err?.message || "Failed to fetch field", loading: false });
      return null;
    }
  },

  create: async (inventoryId: number, data: FieldPayload) => {
    set({ loading: true, error: null });
    try {
      const field = await FieldService.create(inventoryId, data);
      set({ fields: [...get().fields, field], loading: false });
      return field;
    } catch (err: any) {
      set({ error: err?.message || "Failed to create field", loading: false });
      return null;
    }
  },

  update: async (
    inventoryId: number,
    fieldId: number,
    data: Partial<FieldPayload>
  ) => {
    set({ loading: true, error: null });
    try {
      const updatedField = await FieldService.update(
        inventoryId,
        fieldId,
        data
      );
      set({
        fields: get().fields.map((f) => (f.id === fieldId ? updatedField : f)),
        loading: false,
      });
      return updatedField;
    } catch (err: any) {
      set({ error: err?.message || "Failed to update field", loading: false });
      return null;
    }
  },

  remove: async (inventoryId: number, fieldId: number) => {
    set({ loading: true, error: null });
    try {
      await FieldService.delete(inventoryId, fieldId);
      set({
        fields: get().fields.filter((f) => f.id !== fieldId),
        loading: false,
      });
      return true;
    } catch (err: any) {
      set({ error: err?.message || "Failed to delete field", loading: false });
      return false;
    }
  },
}));
