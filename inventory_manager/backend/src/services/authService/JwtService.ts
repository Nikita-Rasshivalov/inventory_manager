import jwt, { SignOptions } from "jsonwebtoken";
import { AuthPayload } from "../../models/types.ts";

export class JwtService {
  private static instance: JwtService;
  private secret = process.env.JWT_SECRET || "default_jwt_secret";
  private expiresIn = 3600;

  private constructor() {}

  public static getInstance(): JwtService {
    if (!JwtService.instance) JwtService.instance = new JwtService();
    return JwtService.instance;
  }

  sign(payload: AuthPayload): string {
    const options: SignOptions = { expiresIn: this.expiresIn };
    return jwt.sign(payload, this.secret, options);
  }

  verify(token: string): AuthPayload | null {
    try {
      return jwt.verify(token, this.secret) as AuthPayload;
    } catch {
      return null;
    }
  }
}
