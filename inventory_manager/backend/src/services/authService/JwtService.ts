import jwt, { SignOptions } from "jsonwebtoken";
import { AuthPayload } from "../../models/types.ts";

export class JwtService {
  private static instance: JwtService;
  private accessSecret = process.env.JWT_ACCESS_SECRET!;
  private accessExpiresIn = process.env.JWT_ACCESS_EXPIRES || "15m";

  private refreshSecret = process.env.JWT_REFRESH_SECRET!;
  private refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES || "30d";

  public static getInstance(): JwtService {
    if (!JwtService.instance) JwtService.instance = new JwtService();
    return JwtService.instance;
  }

  signAccess(payload: AuthPayload): string {
    return jwt.sign(payload, this.accessSecret, {
      expiresIn: this.accessExpiresIn as SignOptions["expiresIn"],
    });
  }

  signRefresh(payload: AuthPayload): string {
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: this.refreshExpiresIn as SignOptions["expiresIn"],
    });
  }

  verifyAccess(token: string): AuthPayload | null {
    try {
      return jwt.verify(token, this.accessSecret) as AuthPayload;
    } catch {
      return null;
    }
  }

  verifyRefresh(token: string): AuthPayload | null {
    try {
      return jwt.verify(token, this.refreshSecret) as AuthPayload;
    } catch {
      return null;
    }
  }
}
