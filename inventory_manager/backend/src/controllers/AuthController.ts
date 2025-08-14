import { Request, Response } from "express";
import { AuthService } from "../services/authService/AuthService.ts";
import { BaseController } from "./BaseController.ts";
import { RefreshTokenService } from "../services/authService/RefreshTokenService.ts";
import { sendErrorResponse } from "../utils/errorHandler.ts";
import { JwtService } from "../services/authService/JwtService.ts";

const authService = new AuthService();
const jwtService = JwtService.getInstance();

export class AuthController extends BaseController {
  refreshTokenService = new RefreshTokenService();

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(result);
    } catch (error) {
      sendErrorResponse(res, error, 400);
    }
  };

  register = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register(name, email, password);
      res.status(201).json(result);
    } catch (error) {
      sendErrorResponse(res, error, 400);
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw new Error("No refresh token provided");

      const result = await authService.logout(refreshToken);
      res.json(result);
    } catch (error) {
      sendErrorResponse(res, error, 400);
    }
  };

  refresh = async (req: Request, res: Response) => {
    try {
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
      res.json({ accessToken });
    } catch (error) {
      sendErrorResponse(res, error, 401);
    }
  };

  me = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user) throw new Error("User not authenticated");

      const dbUser = await authService.getUserById(user.userId);
      if (!dbUser) throw new Error("User not found");

      res.json({ user: dbUser });
    } catch (error) {
      sendErrorResponse(res, error, 400);
    }
  };
}
