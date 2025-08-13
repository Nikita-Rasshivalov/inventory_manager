import { Request, Response, NextFunction } from "express";
import { InventoryRole } from "../models/types.ts";
import { InventoryService } from "../services/userService/InventoryService.ts";

const inventoryService = new InventoryService();

export function authorizeInventoryRole(...allowedRoles: InventoryRole[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { inventoryId } = req.params;
    const role = await inventoryService.getUserRole(user.userId, inventoryId);

    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
