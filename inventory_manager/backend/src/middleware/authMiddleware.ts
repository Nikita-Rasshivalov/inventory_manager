import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth/AuthService.ts";

const authService = new AuthService();

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    role: string;
    [key: string]: any;
  };
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const payload = authService.getJwtPayload(token);
    if (!payload) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = payload;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
