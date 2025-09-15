import { prisma } from "../../prisma/client.ts";

export class AnswerService {
  async addAnswers(questionId: number, answers: { value: string | number }[]) {
    return prisma.answer.createMany({
      data: answers.map((a) => ({
        value: String(a.value),
        questionId,
      })),
    });
  }

  async getAnswers(questionId: number) {
    return prisma.answer.findMany({ where: { questionId } });
  }

  async deleteAnswer(id: number) {
    return prisma.answer.delete({ where: { id } });
  }
}
