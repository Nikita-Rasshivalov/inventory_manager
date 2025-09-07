import { prisma } from "../prisma/client.ts";

export class CategoryService {
  async getAll() {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  }

  async getById(id: number) {
    return prisma.category.findUnique({ where: { id } });
  }
}
