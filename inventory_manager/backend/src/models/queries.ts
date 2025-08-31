import { InventoryRole } from "@prisma/client";
import { CustomIdPart } from "../utils/customId.ts";

export interface InventoryQueryParams {
  page: number;
  limit: number;
  search: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  role?: InventoryRole;
}

export interface UpdateItemData {
  fieldValues?: any[];
  customIdFormat?: CustomIdPart[];
  version: number;
  customId?: string;
}
