import { User } from "../models/models";
import axiosInstance from "../services/axiosInstance";

export class UserApi {
  static async getAll(search?: string): Promise<User[]> {
    const res = await axiosInstance.get<User[]>("/users", {
      params: { q: search },
    });
    return res.data;
  }
}
