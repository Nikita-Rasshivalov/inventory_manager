import { prisma } from "../../prisma/client.ts";

export class TemplateService {
  async createTemplate(authorId: number, name: string) {
    return prisma.template.create({
      data: { name, authorId },
    });
  }

  async getTemplates(authorId: number) {
    return prisma.template.findMany({
      where: { authorId },
      include: { questions: true },
    });
  }

  async getTemplateById(id: number) {
    return prisma.template.findUnique({
      where: { id },
      include: { questions: true },
    });
  }

  async deleteTemplate(id: number, authorId: number) {
    const template = await prisma.template.findUnique({ where: { id } });
    if (!template || template.authorId !== authorId) {
      throw new Error("Template not found or access denied");
    }
    return prisma.template.delete({ where: { id } });
  }
}
