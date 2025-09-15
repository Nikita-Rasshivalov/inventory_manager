import crypto from "crypto";
import { prisma } from "../../prisma/client.ts";

export class OdooService {
  async generateToken(userId: number) {
    const token = crypto.randomBytes(32).toString("hex");

    const odooUser = await prisma.odooUser.upsert({
      where: { userId },
      update: { apiToken: token },
      create: { userId, apiToken: token },
    });

    return { apiToken: odooUser.apiToken };
  }

  async getAggregatedTemplates(token: string) {
    const odooUser = await prisma.odooUser.findUnique({
      where: { apiToken: token },
      include: { user: true },
    });

    if (!odooUser) {
      throw new Error("Invalid API token");
    }

    const templates = await prisma.template.findMany({
      where: { authorId: odooUser.userId },
      include: {
        questions: {
          include: { answers: true },
        },
      },
    });

    return templates.map((t) => ({
      id: t.id,
      name: t.name,
      authorId: t.authorId,
      questions: t.questions.map((q) => ({
        id: q.id,
        text: q.text,
        type: q.type,
        answersCount: q.answers.length,
        aggregated: this.aggregateAnswers(q.answers, q.type),
      })),
    }));
  }

  private aggregateAnswers(answers: any[], type: string) {
    if (!answers || answers.length === 0) return null;

    if (type === "number") {
      const nums = answers.map((a) => Number(a.value)).filter((n) => !isNaN(n));
      const sum = nums.reduce((acc, n) => acc + n, 0);
      return {
        min: Math.min(...nums),
        max: Math.max(...nums),
        avg: sum / nums.length,
      };
    }

    if (type === "text") {
      const freq: Record<string, number> = {};
      for (const a of answers) {
        freq[a.value] = (freq[a.value] || 0) + 1;
      }
      return Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([value, count]) => ({ value, count }));
    }

    return null;
  }
}
