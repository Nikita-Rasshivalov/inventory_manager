import { prisma } from "../prisma/client.ts";

export class UserService {
  async getAll(search?: string) {
    const where = search ? { name: { startsWith: search } } : {};
    return prisma.user.findMany({ where });
  }
}
