import { prisma } from "../prisma/client.ts";

export class OAuthAccountService {
  static async findOrCreate(
    provider: string,
    providerUserId: string,
    userId?: number
  ) {
    let account = await prisma.OAuthAccount.findUnique({
      where: { provider_providerUserId: { provider, providerUserId } },
    });

    if (!account && userId) {
      account = await prisma.OAuthAccount.create({
        data: { provider, providerUserId, userId },
      });
    }

    return account;
  }
}
