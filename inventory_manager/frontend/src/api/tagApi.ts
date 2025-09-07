import axiosInstance from "../services/axiosInstance";
import { Tag } from "../models/models";

export class TagApi {
  static async getAll(): Promise<Tag[]> {
    const res = await axiosInstance.get<Tag[]>("/tags");
    return res.data;
  }

  static async getById(id: number): Promise<Tag> {
    const res = await axiosInstance.get<Tag>(`/tags/${id}`);
    return res.data;
  }
}
