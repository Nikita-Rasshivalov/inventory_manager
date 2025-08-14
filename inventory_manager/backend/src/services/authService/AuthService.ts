import crypto from "crypto";
import { addHours } from "date-fns";
import { hashPassword, comparePasswords } from "../../utils/hash.ts";
import { prisma } from "../../prisma/client.ts";
import { JwtService } from "../authService/JwtService.ts";

export class AuthService {
  private jwtService = JwtService.getInstance();

  async register(name: string, email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("Email already registered");

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return user;
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const match = await comparePasswords(password, user.password!);
    if (!match) throw new Error("Invalid credentials");

    const accessToken = this.jwtService.signAccess({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = crypto.randomBytes(64).toString("hex");
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: addHours(new Date(), 24 * 30),
      },
    });

    return { accessToken, refreshToken, user };
  }

  async logout(refreshToken: string) {
    const token = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });
    if (!token) throw new Error("Token not found");

    await prisma.refreshToken.update({
      where: { token: refreshToken },
      data: { revokedAt: new Date() },
    });

    return { message: "Logged out successfully" };
  }

  async refreshAccessToken(refreshToken: string) {
    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date())
      throw new Error("Invalid refresh token");

    const user = await prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user) throw new Error("User not found");

    const accessToken = this.jwtService.signAccess({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken };
  }

  getJwtPayload(token: string) {
    return this.jwtService.verifyAccess(token);
  }

  async getUserById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  async revokeRefreshToken(refreshToken: string) {
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revokedAt: new Date() },
    });
  }
}
