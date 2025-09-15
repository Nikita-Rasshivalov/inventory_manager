import { QuestionApi } from "../../api/Odoo/questionApi";

export const QuestionService = {
  getAll: async (templateId: number) => QuestionApi.getAll(templateId),
  add: async (
    templateId: number,
    questions: { text: string; type: string }[]
  ) => QuestionApi.add(templateId, questions),
  delete: async (id: number) => QuestionApi.delete(id),
};
