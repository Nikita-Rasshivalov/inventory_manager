import { prisma } from "../../prisma/client.ts";

export class QuestionService {
  async addQuestions(
    templateId: number,
    questions: { text: string; type: string }[]
  ) {
    return prisma.question.createMany({
      data: questions.map((q) => ({
        text: q.text,
        type: q.type,
        templateId,
      })),
    });
  }
  async getQuestions(templateId: number) {
    return prisma.question.findMany({
      where: { templateId },
      include: { answers: true },
    });
  }

  async deleteQuestion(id: number) {
    return prisma.question.delete({ where: { id } });
  }
}
