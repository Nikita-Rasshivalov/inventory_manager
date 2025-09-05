import { prisma } from "../prisma/client.ts";

export class GuestService {
  async getLatestInventories(limit: number = 10) {
    return prisma.inventory.findMany({
      where: {
        deleted: false,
        isPublic: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      select: {
        id: true,
        title: true,
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
      },
    });
  }

  async getTopInventories(limit: number = 5) {
    return prisma.inventory.findMany({
      where: {
        deleted: false,
        isPublic: true,
      },
      orderBy: {
        items: {
          _count: "desc",
        },
      },
      take: limit,
      select: {
        id: true,
        title: true,
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
    });
  }
}

export const guestService = new GuestService();
