import { prisma } from "../prisma/client.ts";

export class UserService {
  async getAll(search?: string) {
    const where = search ? { name: { startsWith: search } } : {};
    return prisma.user.findMany({ where });
  }

  async updateProfilePhoto(userId: number, photoUrl: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { imageUrl: photoUrl },
    });
  }

  async getById(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        role: true,
      },
    });
  }
}
