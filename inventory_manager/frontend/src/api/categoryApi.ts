import axiosInstance from "../services/axiosInstance";
import { Category } from "../models/models";

export class CategoryApi {
  static async getAll(): Promise<Category[]> {
    const res = await axiosInstance.get<Category[]>("/categories");
    return res.data;
  }

  static async getById(id: number): Promise<Category> {
    const res = await axiosInstance.get<Category>(`/categories/${id}`);
    return res.data;
  }
}
