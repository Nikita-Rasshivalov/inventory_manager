import { Request, Response, NextFunction } from "express";
import { InventoryRole, SystemRole } from "@prisma/client";
import { InventoryService } from "../services/InventoryService.ts";

const inventoryService = new InventoryService();

export function authorizeInventoryRole(...allowedRoles: InventoryRole[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    if (user.role === SystemRole.ADMIN) return next();

    const { inventoryId } = req.params;
    const role = await inventoryService.getUserRole(
      user.userId,
      Number(inventoryId)
    );
    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
}
