import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "../utils/tokenUtils";
import { logout } from "./authActions";
import { AuthApi } from "../api/authApi";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

instance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token)
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      try {
        const res = await AuthApi.refresh();
        saveTokens(res.accessToken, refreshToken);
        originalRequest.headers["Authorization"] = `Bearer ${res.accessToken}`;
        return instance(originalRequest);
      } catch {
        logout();
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
