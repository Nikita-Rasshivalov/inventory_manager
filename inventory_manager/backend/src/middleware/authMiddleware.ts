import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService/AuthService.ts";
import { AuthPayload } from "../models/types.ts";

const authService = new AuthService();

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const payload = authService.getJwtPayload(token) as AuthPayload | null;

    if (!payload) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    (req as Request & { user?: AuthPayload }).user = payload;

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
