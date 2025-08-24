import { InventoryRole } from "@prisma/client";

export interface InventoryQueryParams {
  page: number;
  limit: number;
  search: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  role?: InventoryRole;
}
