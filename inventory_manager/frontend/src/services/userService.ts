import { UserApi } from "../api/userApi";
import { User } from "../models/models";

export const UserService = {
  getAll: async (search?: string): Promise<User[]> => {
    return await UserApi.getAll(search);
  },
  uploadProfilePhoto: async (file: File): Promise<User> => {
    return await UserApi.uploadProfilePhoto(file);
  },
  getById: async (userId: number): Promise<User> => {
    return await UserApi.getById(userId);
  },
};
