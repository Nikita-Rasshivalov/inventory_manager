import { UserApi } from "../api/userApi";
import { User } from "../models/models";

export const UserService = {
  getAll: async (search?: string): Promise<User[]> => {
    return await UserApi.getAll(search);
  },
};
