import jwt, { SignOptions } from "jsonwebtoken";
import { SystemRole } from "../models/types.ts";

export type JwtPayload = {
  userId: number;
  email: string;
  role: SystemRole;
};

export class JwtService {
  private static instance: JwtService;
  private secret = process.env.JWT_SECRET || "default_jwt_secret";
  private expiresIn = 3600;

  private constructor() {}

  public static getInstance(): JwtService {
    if (!JwtService.instance) JwtService.instance = new JwtService();
    return JwtService.instance;
  }

  sign(payload: JwtPayload): string {
    const options: SignOptions = { expiresIn: this.expiresIn };
    return jwt.sign(payload, this.secret, options);
  }

  verify(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this.secret) as JwtPayload;
    } catch {
      return null;
    }
  }
}
