import axiosInstance from "../services/axiosInstance";
import { User } from "../models/models";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  error?: string;
}

export class AuthApi {
  static async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/register",
      data
    );
    return response.data;
  }

  static async login(data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/login",
      data
    );
    return response.data;
  }

  static async refresh(): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>("/auth/refresh");
    return response.data;
  }

  static async logout(): Promise<{ message: string }> {
    const response = await axiosInstance.post<{ message: string }>(
      "/auth/logout"
    );
    return response.data;
  }

  static async getCurrentUser(): Promise<User> {
    const response = await axiosInstance.get<User>("/auth/me");
    return response.data;
  }

  static loginWithGoogle() {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  }

  static loginWithGitHub() {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
  }
}
