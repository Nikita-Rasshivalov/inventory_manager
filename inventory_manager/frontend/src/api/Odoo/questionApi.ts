import axiosInstance from "../../services/axiosInstance";
import { Question } from "../../models/models";

export class QuestionApi {
  static async getAll(templateId: number): Promise<Question[]> {
    const res = await axiosInstance.get<Question[]>(
      `/questions/template/${templateId}`
    );
    return res.data;
  }

  static async add(
    templateId: number,
    questions: { text: string; type: string }[]
  ): Promise<Question[]> {
    const res = await axiosInstance.post<Question[]>(`/questions`, {
      templateId,
      questions,
    });
    return res.data;
  }

  static async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/questions/${id}`);
  }
}
