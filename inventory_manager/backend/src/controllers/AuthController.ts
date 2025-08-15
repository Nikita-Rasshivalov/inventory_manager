import { Request, Response } from "express";
import { AuthService } from "../services/authService/AuthService.ts";
import { BaseController } from "./BaseController.ts";
import { RefreshTokenService } from "../services/authService/RefreshTokenService.ts";
import { JwtService } from "../services/authService/JwtService.ts";

const authService = new AuthService();
const jwtService = JwtService.getInstance();

export class AuthController extends BaseController {
  refreshTokenService = new RefreshTokenService();

  login = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const { email, password } = req.body;
      return await authService.login(email, password);
    });

  register = (req: Request, res: Response) =>
    this.handle(
      res,
      async () => {
        const { name, email, password } = req.body;
        return await authService.register(name, email, password);
      },
      201
    );

  logout = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const { refreshToken } = req.body;
      if (!refreshToken) throw new Error("No refresh token provided");
      return await authService.logout(refreshToken);
    });

  refresh = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const { token, ipAddress, userAgent } = req.body;
      if (!token) throw new Error("No token provided");

      const stored = await this.refreshTokenService.findValid(
        token,
        ipAddress,
        userAgent
      );
      if (!stored) throw new Error("Invalid refresh token");

      const accessToken = jwtService.signAccess({
        userId: stored.userId,
        email: stored.user.email,
        role: stored.user.role,
      });

      return { accessToken };
    });

  me = (req: Request, res: Response) =>
    this.handle(res, async () => {
      const user = (req as any).user;
      if (!user) throw new Error("User not authenticated");

      const dbUser = await authService.getUserById(user.userId);
      if (!dbUser) throw new Error("User not found");

      return { user: dbUser };
    });
}
