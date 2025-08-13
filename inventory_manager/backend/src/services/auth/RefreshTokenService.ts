import { prisma } from "../prisma/client.ts";

export class RefreshTokenService {
  async findValid(token: string, ipAddress?: string, userAgent?: string) {
    const stored = await prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.revokedAt || stored.expiresAt < new Date())
      return null;

    if (stored.ipAddress && ipAddress && stored.ipAddress !== ipAddress)
      return null;
    if (stored.userAgent && userAgent && stored.userAgent !== userAgent)
      return null;

    return stored;
  }

  async revoke(token: string) {
    return prisma.refreshToken.update({
      where: { token },
      data: { revokedAt: new Date() },
    });
  }

  async create(
    userId: number,
    token: string,
    expiresAt: Date,
    ipAddress?: string,
    userAgent?: string
  ) {
    return prisma.refreshToken.create({
      data: { userId, token, expiresAt, ipAddress, userAgent },
    });
  }
}
