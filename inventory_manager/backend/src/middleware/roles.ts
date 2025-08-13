import { Request, Response, NextFunction } from "express";
import { SystemRole } from "../models/types.ts";

export function authorizeRoles(...allowedRoles: SystemRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
