import { Answer } from "../../models/models";
import axiosInstance from "../../services/axiosInstance";

export class AnswerApi {
  static async getAll(questionId: number): Promise<Answer[]> {
    const res = await axiosInstance.get<Answer[]>(
      `/answers/question/${questionId}`
    );
    return res.data;
  }

  static async add(
    questionId: number,
    answers: { value: string | number }[]
  ): Promise<Answer[]> {
    const res = await axiosInstance.post<Answer[]>(`/answers`, {
      questionId,
      answers,
    });
    return res.data;
  }

  static async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/answers/${id}`);
  }
}
