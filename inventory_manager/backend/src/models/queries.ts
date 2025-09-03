import { InventoryRole } from "@prisma/client";
import { CustomIdPart } from "../utils/customId.ts";
import { InventoryFilter } from "./types.ts";

export interface InventoryQueryParams {
  page: number;
  limit: number;
  search: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  inventoryFilter?: InventoryFilter;
}

export interface UpdateItemData {
  fieldValues?: any[];
  customIdFormat?: CustomIdPart[];
  version: number;
  customId?: string;
  order?: number;
}
