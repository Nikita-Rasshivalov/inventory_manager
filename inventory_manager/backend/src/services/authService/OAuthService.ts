import { addHours } from "date-fns";
import { prisma } from "../../prisma/client.ts";
import { JwtService } from "./JwtService.ts";
import crypto from "crypto";

export class OAuthService {
  private jwt = JwtService.getInstance();

  async loginOrRegister(
    provider: string,
    providerUserId: string,
    email: string,
    name: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    let account = await prisma.oAuthAccount.findUnique({
      where: { provider_providerUserId: { provider, providerUserId } },
      select: { id: true, userId: true },
    });

    let userId: number;

    if (!account) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        userId = existingUser.id;
        await prisma.oAuthAccount.create({
          data: { provider, providerUserId, userId },
        });
      } else {
        const user = await prisma.user.create({
          data: { email, name, password: null },
        });
        userId = user.id;
        await prisma.oAuthAccount.create({
          data: { provider, providerUserId, userId },
        });
      }
    } else {
      userId = account.userId;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const accessToken = this.jwt.signAccess({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = crypto.randomBytes(64).toString("hex");

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        ipAddress,
        userAgent,
        expiresAt: addHours(new Date(), 24 * 30),
      },
    });

    return { accessToken, refreshToken, user };
  }
}
