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
    let payload: AuthPayload | undefined;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      payload =
        (authService.getJwtPayload(token) as AuthPayload | null) || undefined;
    }

    (req as Request & { user?: AuthPayload }).user = payload;

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    (req as Request & { user?: AuthPayload }).user = undefined;
    next();
  }
}
