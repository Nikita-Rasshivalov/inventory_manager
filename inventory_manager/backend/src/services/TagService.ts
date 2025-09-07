import { prisma } from "../prisma/client.ts";

export class TagService {
  async getAll() {
    return prisma.tag.findMany({
      orderBy: { name: "asc" },
    });
  }

  async getById(id: number) {
    return prisma.tag.findUnique({ where: { id } });
  }

  async searchByName(query: string) {
    return prisma.tag.findMany({
      where: { name: { startsWith: query } },
      orderBy: { name: "asc" },
      take: 10,
    });
  }

  async create(name: string) {
    return prisma.tag.create({ data: { name } });
  }

  async getTopTags(limit: number = 20) {
    return prisma.tag.findMany({
      take: limit,
      orderBy: {
        inventories: { _count: "desc" },
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: { inventories: true },
        },
      },
    });
  }
}

export const tagService = new TagService();
