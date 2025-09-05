import { Request, Response, NextFunction } from "express";
import { InventoryRole, SystemRole } from "@prisma/client";
import { InventoryService } from "../services/InventoryService.ts";

const inventoryService = new InventoryService();

export async function authorizeInventoryBulkRole(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  if (user.role === SystemRole.ADMIN) return next();

  const ids: number[] = req.body.ids;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "No inventories provided" });
  }

  const roles = await Promise.all(
    ids.map((id) => inventoryService.getUserRole(user.userId, id))
  );

  const allowedIds = ids.filter((_, idx) => roles[idx] === InventoryRole.OWNER);

  if (!allowedIds.length) {
    return res.status(403).json({ error: "Access denied for all inventories" });
  }

  (req as any).allowedIds = allowedIds;

  next();
}
