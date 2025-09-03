import { User } from "../models/models";
import axiosInstance from "../services/axiosInstance";

export class UserApi {
  static async getAll(search?: string): Promise<User[]> {
    const res = await axiosInstance.get<User[]>("/users", {
      params: { q: search },
    });
    return res.data;
  }

  static async uploadProfilePhoto(file: File): Promise<User> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axiosInstance.post<User>(
      "/users/upload-profile-photo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  }

  static async getById(userId: number): Promise<User> {
    const res = await axiosInstance.get<User>(`/users/${userId}`);
    return res.data;
  }
}
