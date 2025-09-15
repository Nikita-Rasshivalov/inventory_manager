import axiosInstance from "../../services/axiosInstance";
import { Template } from "../../models/models";

export class TemplateApi {
  static async getAll(): Promise<Template[]> {
    const res = await axiosInstance.get<Template[]>("/templates");
    return res.data;
  }

  static async getById(id: number): Promise<Template> {
    const res = await axiosInstance.get<Template>(`/templates/${id}`);
    return res.data;
  }

  static async create(template: {
    name: string;
    userId: number;
  }): Promise<Template> {
    const res = await axiosInstance.post<Template>("/templates", template);
    return res.data;
  }

  static async update(id: number, data: { name: string }): Promise<Template> {
    const res = await axiosInstance.put<Template>(`/templates/${id}`, data);
    return res.data;
  }

  static async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/templates/${id}`);
  }
}
