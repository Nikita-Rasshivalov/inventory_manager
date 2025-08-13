import { addHours } from "date-fns";
import { prisma } from "../../prisma/client.ts";
import { JwtService } from "./JwtService.ts";
import { randomBytes } from "crypto";
import { OAuthAccountService } from "./OAuthAccountService.ts";

const jwtService = JwtService.getInstance();

export class OAuthService {
  async loginOrRegister(
    provider: string,
    providerUserId: string,
    email: string,
    name: string
  ) {
    let account = await OAuthAccountService.findOrCreate(
      provider,
      providerUserId
    );
    let user;

    if (!account) {
      user = await prisma.user.create({ data: { name, email } });
      account = await OAuthAccountService.findOrCreate(
        provider,
        providerUserId,
        user.id
      );
    } else {
      user = await prisma.user.findUnique({ where: { id: account.userId } });
    }

    const token = jwtService.sign({
      userId: user!.id,
      email: user!.email,
      role: user!.role,
    });
    const refreshToken = randomBytes(64).toString("hex");

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user!.id,
        expiresAt: addHours(new Date(), 24 * 30),
      },
    });

    return { token, refreshToken, user };
  }
}
