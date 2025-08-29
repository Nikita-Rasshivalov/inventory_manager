import { SystemRole } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

export function authorizeRoles(...allowedRoles: SystemRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}
