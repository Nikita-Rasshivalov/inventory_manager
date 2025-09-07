import { prisma } from "../prisma/client.ts";

export class GuestService {
  async getLatestInventories(limit: number = 10) {
    const inventories = await prisma.inventory.findMany({
      where: {
        deleted: false,
        isPublic: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        owner: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
        tags: { select: { tag: { select: { id: true, name: true } } } },
        createdAt: true,
      },
    });

    return inventories.map((inv) => ({
      ...inv,
      tags: inv.tags.map((t) => t.tag),
    }));
  }

  async getTopInventories(limit: number = 5) {
    const inventories = await prisma.inventory.findMany({
      where: { deleted: false, isPublic: true },
      orderBy: { items: { _count: "desc" } },
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        owner: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
        tags: { select: { tag: { select: { id: true, name: true } } } },
        _count: { select: { items: true } },
      },
    });

    return inventories.map((inv) => ({
      ...inv,
      tags: inv.tags.map((t) => t.tag),
    }));
  }
  async getInventoriesByTag(tag: string) {
    return prisma.inventory.findMany({
      where: {
        deleted: false,
        isPublic: true,
        tags: {
          some: {
            tag: {
              name: tag,
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        owner: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
        tags: { select: { tag: { select: { id: true, name: true } } } },
      },
    });
  }
}

export const guestService = new GuestService();
