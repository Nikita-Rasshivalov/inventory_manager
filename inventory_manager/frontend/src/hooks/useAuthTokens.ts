import { useState } from "react";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearAuthData,
} from "../utils/tokenUtils";

export const useAuthTokens = () => {
  const [token, setToken] = useState<string | null>(getAccessToken());

  const setAuth = (accessToken: string, refreshToken: string) => {
    saveTokens(accessToken, refreshToken);
    setToken(accessToken);
  };

  const clearAuth = () => {
    clearAuthData();
    setToken(null);
  };

  return { token, setAuth, clearAuth, refreshToken: getRefreshToken() };
};
