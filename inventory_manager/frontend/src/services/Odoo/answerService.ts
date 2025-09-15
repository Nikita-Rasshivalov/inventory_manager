import { AnswerApi } from "../../api/Odoo/answerApi";

export const AnswerService = {
  getAll: async (questionId: number) => AnswerApi.getAll(questionId),
  add: async (questionId: number, answers: { value: string | number }[]) =>
    AnswerApi.add(questionId, answers),
  delete: async (id: number) => AnswerApi.delete(id),
};
