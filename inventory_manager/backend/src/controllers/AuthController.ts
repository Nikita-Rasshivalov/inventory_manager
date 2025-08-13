import { Request, Response } from "express";
import { AuthService } from "../services/authService/AuthService.ts";
import { BaseController } from "./BaseController.ts";
import { sign } from "jsonwebtoken";
import { RefreshTokenService } from "../services/authService/RefreshTokenService.ts";

const authService = new AuthService();

export class AuthController extends BaseController {
  refreshTokenService = new RefreshTokenService();

  login = async (req: Request, res: Response) => {
    await this.handle(res, async () => {
      const { email, password } = req.body;
      return await authService.login(email, password);
    });
  };

  register = async (req: Request, res: Response) => {
    await this.handle(
      res,
      async () => {
        const { name, email, password } = req.body;
        return await authService.register(name, email, password);
      },
      201
    );
  };

  logout = async (req: Request, res: Response) => {
    await this.handle(res, async () => {
      const { refreshToken } = req.body;
      if (!refreshToken) throw new Error("No refresh token provided");

      return await authService.logout(refreshToken);
    });
  };

  refresh = async (req: Request, res: Response) => {
    const { token, ipAddress, userAgent } = req.body;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const stored = await this.refreshTokenService.findValid(
      token,
      ipAddress,
      userAgent
    );
    if (!stored)
      return res.status(401).json({ message: "Invalid refresh token" });

    const accessToken = sign(
      { userId: stored.userId, role: stored.user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );
    res.json({ accessToken });
  };

  me = async (req: Request, res: Response) => {
    await this.handle(res, async () => {
      const user = (req as any).user;
      if (!user) throw new Error("User not authenticated");

      const dbUser = await authService.getUserById(user.userId);
      if (!dbUser) throw new Error("User not found");

      return { user: dbUser };
    });
  };
}
