import { AuthApi } from "../api/authApi";
import { User } from "../models/models";
import {
  getRefreshToken,
  saveTokens,
  clearAuthData,
} from "../utils/tokenUtils";

export const AuthService = {
  login: async (
    email: string,
    password: string
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
    const res = await AuthApi.login({ email, password });
    saveTokens(res.accessToken, res.refreshToken);
    return res;
  },

  register: async (name: string, email: string, password: string) => {
    await AuthApi.register({ name, email, password });
  },

  refresh: async (): Promise<string | null> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;
    try {
      const res = await AuthApi.refresh();
      saveTokens(res.accessToken, refreshToken);
      return res.accessToken;
    } catch {
      clearAuthData();
      return null;
    }
  },

  getCurrentUser: async (): Promise<User> => {
    return AuthApi.getCurrentUser();
  },
  loginWithGoogle: () => {
    AuthApi.loginWithGoogle();
  },

  loginWithGitHub: () => {
    AuthApi.loginWithGitHub();
  },
};
